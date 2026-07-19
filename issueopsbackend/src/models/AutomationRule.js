import mongoose from 'mongoose';

const automationRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
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
    trigger: {
      type: String,
      enum: [
        'ISSUE_CREATED',
        'ISSUE_STATUS_CHANGED',
        'ISSUE_ASSIGNED',
        'COMMENT_CREATED',
        'DUE_DATE_NEAR',
        'PRIORITY_CHANGED',
      ],
      required: true,
    },
    conditionField: {
      type: String,
      required: true,
    },
    conditionOperator: {
      type: String,
      enum: ['equals', 'not_equals', 'contains', 'greater_than'],
      required: true,
    },
    conditionValue: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      enum: [
        'SEND_NOTIFICATION',
        'SEND_EMAIL',
        'TRIGGER_WEBHOOK',
        'ASSIGN_USER',
        'ADD_LABEL',
      ],
      required: true,
    },
    actionTarget: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

automationRuleSchema.index({ workspace: 1, enabled: 1 });
automationRuleSchema.index({ workspace: 1, trigger: 1 });

const AutomationRule = mongoose.model('AutomationRule', automationRuleSchema);
export default AutomationRule;