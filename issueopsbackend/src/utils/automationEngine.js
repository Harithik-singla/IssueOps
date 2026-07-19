import AutomationRule from '../models/AutomationRule.js';
import { createNotification } from './notificationService.js';
import WorkspaceMember from '../models/WorkspaceMember.js';

// ── Evaluate a condition against an issue ──────────────
const evaluateCondition = (rule, issue) => {
  const { conditionField, conditionOperator, conditionValue } = rule;

  // Get the value of the field from the issue
  const fieldValue = String(issue[conditionField] || '').toLowerCase();
  const ruleValue  = conditionValue.toLowerCase();

  switch (conditionOperator) {
    case 'equals':
      return fieldValue === ruleValue;
    case 'not_equals':
      return fieldValue !== ruleValue;
    case 'contains':
      return fieldValue.includes(ruleValue);
    case 'greater_than':
      return Number(fieldValue) > Number(ruleValue);
    default:
      return false;
  }
};

// ── Execute an action ──────────────────────────────────
const executeAction = async (rule, issue, triggeredBy) => {
  switch (rule.actionType) {

    case 'SEND_NOTIFICATION': {
      // Resolve who to notify
      let recipients = [];

      if (rule.actionTarget === 'workspace_admins') {
        const admins = await WorkspaceMember.find({
          workspace: rule.workspace,
          role: { $in: ['OWNER', 'ADMIN'] },
        });
        recipients = admins.map(a => a.user);
      } else if (rule.actionTarget === 'assignee' && issue.assignee) {
        recipients = [issue.assignee._id || issue.assignee];
      } else if (rule.actionTarget === 'project_lead') {
        const lead = await WorkspaceMember.findOne({
          workspace: rule.workspace,
          role: { $in: ['OWNER', 'ADMIN'] },
        });
        if (lead) recipients = [lead.user];
      } else {
        // Treat actionTarget as a user ID
        recipients = [rule.actionTarget];
      }

      // Create notification for each recipient
      await Promise.all(
        recipients.map(recipientId =>
          createNotification({
            recipient:   recipientId,
            type:        'AUTOMATION_ALERT',
            title:       `Automation: ${rule.name}`,
            message:     `Rule "${rule.name}" triggered for issue "${issue.title}"`,
            link:        `/issues/${issue._id}`,
            workspace:   rule.workspace,
            relatedIssue: issue._id,
            triggeredBy: triggeredBy?._id || null,
          })
        )
      );
      break;
    }

    case 'ADD_LABEL': {
      // Add label to issue if not already present
      const Issue = (await import('../models/Issue.js')).default;
      const labels = issue.labels || [];
      if (!labels.includes(rule.actionTarget)) {
        await Issue.findByIdAndUpdate(issue._id, {
          $addToSet: { labels: rule.actionTarget },
        });
      }
      break;
    }

    case 'TRIGGER_WEBHOOK': {
      // We will connect this to the webhook system later
      console.log(`Webhook trigger: ${rule.actionTarget} for issue ${issue._id}`);
      break;
    }

    case 'SEND_EMAIL': {
      // Placeholder — connect to an email service later
      console.log(`Email action triggered for rule: ${rule.name}`);
      break;
    }

    case 'ASSIGN_USER': {
      const Issue = (await import('../models/Issue.js')).default;
      await Issue.findByIdAndUpdate(issue._id, {
        assignee: rule.actionTarget,
      });
      break;
    }

    default:
      break;
  }
};

// ── Main engine function ───────────────────────────────
export const runAutomationRules = async ({ trigger, issue, triggeredBy }) => {
  try {
    // 1. Find all enabled rules for this workspace with this trigger
    const rules = await AutomationRule.find({
      workspace: issue.workspace,
      trigger,
      enabled: true,
    });

    if (rules.length === 0) return;

    // 2. Evaluate each rule's condition
    for (const rule of rules) {
      const conditionMet = evaluateCondition(rule, issue);

      if (conditionMet) {
        console.log(`✅ Automation rule matched: ${rule.name}`);
        await executeAction(rule, issue, triggeredBy);
      }
    }
  } catch (error) {
    // Automation is non-critical — log but don't crash
    console.error('Automation engine error:', error);
  }
};