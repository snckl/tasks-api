import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Task must have a title.'],
    unique: [true, 'This task already exist.'],
  },
  severity: {
    type: String,
    required: [true, 'Task must have a severity.'],
  },
  priority: {
    type: String,
    required: [true, 'Task must have a priority.'],
  },
  description: {
    type: String,
    required: [true, 'Task must have a description.'],
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
      required: [true, 'Name must be provided by the reporter.'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Email required in order to contact.'],
    },
  },
  uploadDate: {
    type: Date,
    default: Date.now(),
  },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
