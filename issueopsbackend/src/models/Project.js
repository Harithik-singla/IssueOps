import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED'],
      default: 'ACTIVE',
    },
    deadline: {
      type: Date,
      default: null,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Index for fast lookup by workspace ─────────────────
projectSchema.index({ workspace: 1 });
projectSchema.index({ workspace: 1, createdBy: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;