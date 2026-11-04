const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [120, 'Job role cannot exceed 120 characters'],
    },
    jobDescription: {
      type: String,
      default: '',
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: '',
    },
    applicationLink: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: 'Not specified',
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    dateApplied: {
      type: Date,
      required: [true, 'Application date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, 'Application status is required'],
      enum: {
        values: [
          'Applied',
          'Online Test',
          'Technical Interview',
          'HR Interview',
          'Offer',
          'Rejected',
          'On Hold',
          // Allow legacy 'Interview' for backwards-compatibility
          'Interview',
        ],
        message: '{VALUE} is not a valid status',
      },
      default: 'Applied',
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    interviewTime: {
      type: String,
      trim: true,
      default: '',
    },
    interviewType: {
      type: String,
      enum: ['Online / Video Call', 'On-Campus', 'In-Person', 'Phone Screening', 'Not specified'],
      default: 'Online / Video Call',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    activityTimeline: {
      type: [timelineItemSchema],
      default: function() {
        return [{ status: this.status || 'Applied', date: this.dateApplied || new Date(), note: 'Application initial creation' }];
      },
    },
  },
  {
    timestamps: true,
  }
);

// Performance indexes
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, dateApplied: -1 });
applicationSchema.index({ userId: 1, interviewDate: 1 });
applicationSchema.index({ userId: 1, companyName: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
