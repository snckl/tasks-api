import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Task must have a title'],
      unique: [true, 'This task already exist'],
      validate: [validator.isAlpha, 'Title must contain characters.'],
    },
    severity: {
      type: String,
      required: [true, 'Task must have a severity'],
      enum: {
        values: ['Minor', 'Low', 'Major', 'Critical'],
        message: 'Severity must be one of those | Minor Low Major Critical',
      },
    },
    priority: {
      type: String,
      required: [true, 'Task must have a priority'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be one of those | Low Medium High',
      },
    },
    priorityScore: {
      type: Number,
      required: [true, 'Priority score need.'],
      min: [1, 'Score must be between 1 and 100'],
      max: [100, 'Score must be between 1 and 100'],
    },
    description: {
      type: String,
      required: [true, 'Task must have a description'],
    },
    status: {
      type: String,
      default: 'Open',
    },
    expected_result: {
      type: String,
    },
    actual_result: {
      type: String,
    },
    attachments: {
      type: String,
    },
    reportedBy: {
      contactPerson: {
        type: String,
        required: [true, 'It should be known who reported it'],
      },
      contactEmail: {
        type: String,
        required: [true, 'Email is required for communication'],
        //DOES NOT WORK ON UPDATE.
        validate: {
          validator: function (email) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(email);
          },
          message: '({VALUE}) Invalid email.',
        },
      },
    },
    accumulatedCost: {
      type: Number,
    },
    uploadDate: {
      type: Date,
    },
    authRequired: {
      type: Boolean,
      default: false,
    },
  },
  {
    //Activated virtuals.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Not going to be saved to database.
// WARNING! WE CAN NOT USE THIS IN QUERY.
taskSchema.virtual('sinceCreation').get(function () {
  return `${Math.floor(
    (Date.now() - this.uploadDate) / (1000 * 60 * 60 * 24)
  )} Days`;
});

//Mongoose document middleware works before save ,create and insertMany event.
taskSchema.pre('save', function (next) {
  this.uploadDate = Date.now();
  next();
});

//Mongoose query middleware works before find method.
taskSchema.pre(/^find/, function (next) {
  this.find({ authRequired: { $ne: true } });
  next();
});

//Mongoose aggregation middleware works before aggregate method.
taskSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { authRequired: { $ne: true } } });
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
