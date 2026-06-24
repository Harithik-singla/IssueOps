import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    status: {
      type: String,
      enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE', 'CANCELLED'],
      default: 'TODO',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    type: {
      type: String,
      enum: ['TASK', 'BUG', 'FEATURE', 'DOCUMENTATION', 'RESEARCH', 'IMPROVEMENT'],
      default: 'TASK',
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    labels: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────────────
issueSchema.index({ project: 1 });
issueSchema.index({ workspace: 1 });
issueSchema.index({ assignee: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ project: 1, status: 1 });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;