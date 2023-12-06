import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is missing'],
  },
  email: {
    type: String,
    required: [true, 'Email is missing'],
    unique: [true, 'This email already exist'],
    lowercase: true,
    validate: {
      validator: function (email) {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(email);
      },
      message: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is missing'],
    minlength: [8, 'Password must be longer than 8 characters'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //ONLY WORKS ON SAVE/CREATE.
      validator: function (el) {
        return this.password === el;
      },
      message: 'Passwords does not match.',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Mongoose pre-hook middleware for 'find' queries on the user schema
userSchema.pre(/^find/, function (next) {
  // Modify the 'find' query to exclude users with 'active' set to false
  this.find({ active: { $ne: false } });
  next();
});

// Mongoose pre-hook middleware for 'save' operation on the user schema
userSchema.pre('save', async function (next) {
  // Check if the password field has been modified
  if (!this.isModified('password')) return next();

  // Hash the password with a cost factor of 12 using bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  // Set confirmPassword field to undefined to prevent it from persisting to the database
  this.confirmPassword = undefined;
  next();
});

// Mongoose pre-hook middleware for 'save' operation on the user schema
userSchema.pre('save', function (next) {
  // Check if the password has not been modified or if it's a new user
  if (!this.isModified('password') || this.isNew) return next();

  // Set the passwordChangedAt field to the current date and time with a slight adjustment
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Method to compare a candidate password with the hashed user password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // Use bcrypt.compare to compare the candidatePassword with the userPassword
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if the user's password has been changed after a certain timestamp
userSchema.methods.changedPassword = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

// Method to create a password reset token for the user
userSchema.methods.createPasswordResetToken = function () {
  // Generate a random reset token as a hexadecimal string
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Hash the reset token and set it in the user document
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set the expiration timestamp for the password reset token (10 minutes from now)
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;

  // Return the unhashed reset token
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
