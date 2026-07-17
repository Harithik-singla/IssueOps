import Notification from '../models/Notification.js';

export const createNotification = async ({
  recipient,
  type,
  title,
  message,
  link,
  workspace,
  relatedIssue  = null,
  relatedProject = null,
  triggeredBy   = null,
}) => {
  try {
    // Don't notify yourself
    if (recipient.toString() === triggeredBy?.toString()) return null;

    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      link,
      workspace,
      relatedIssue,
      relatedProject,
      triggeredBy,
    });

    return notification;
  } catch (error) {
    // Notifications are non-critical
    // If creation fails, log it but don't crash the main request
    console.error('Failed to create notification:', error);
    return null;
  }
};

export const createMentionNotifications = async ({
  content,
  mentionedUsers,
  triggeredBy,
  workspace,
  issue,
  issueTitle,
}) => {
  const notifications = await Promise.all(
    mentionedUsers.map((userId) =>
      createNotification({
        recipient:     userId,
        type:          'MENTION',
        title:         'You were mentioned',
        message:       `${triggeredBy.name} mentioned you in "${issueTitle}"`,
        link:          `/issues/${issue}`,
        workspace,
        relatedIssue:  issue,
        triggeredBy:   triggeredBy._id,
      })
    )
  );
  return notifications.filter(Boolean);
};

export const createAssignmentNotification = async ({
  assignee,
  triggeredBy,
  workspace,
  issue,
  issueTitle,
}) => {
  return createNotification({
    recipient:    assignee,
    type:         'ASSIGNMENT',
    title:        'Issue assigned to you',
    message:      `${triggeredBy.name} assigned "${issueTitle}" to you`,
    link:         `/issues/${issue}`,
    workspace,
    relatedIssue: issue,
    triggeredBy:  triggeredBy._id,
  });
};

export const createStatusChangeNotification = async ({
  recipient,
  triggeredBy,
  workspace,
  issue,
  issueTitle,
  oldStatus,
  newStatus,
}) => {
  return createNotification({
    recipient,
    type:         'STATUS_CHANGE',
    title:        'Issue status changed',
    message:      `${triggeredBy.name} changed "${issueTitle}" from ${oldStatus} to ${newStatus}`,
    link:         `/issues/${issue}`,
    workspace,
    relatedIssue: issue,
    triggeredBy:  triggeredBy._id,
  });
};