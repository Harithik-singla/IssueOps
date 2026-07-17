import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ── Get all notifications for current user ─────────────
export const getNotifications = async (req, res) => {
  try {
    const filter = { recipient: req.user.id };

    // Optional filter for unread only
    if (req.query.unread === 'true') {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .populate('triggeredBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    return sendSuccess(res, { notifications, unreadCount });
  } catch (error) {
    console.error('getNotifications error:', error);
    return sendError(res, 'Failed to fetch notifications', 500);
  }
};

// ── Mark single notification as read ──────────────────
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id:       notificationId,
        recipient: req.user.id,     // ensure it belongs to this user
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    return sendSuccess(res, { notification }, 'Marked as read');
  } catch (error) {
    console.error('markAsRead error:', error);
    return sendError(res, 'Failed to mark notification as read', 500);
  }
};

// ── Mark all notifications as read ────────────────────
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );

    return sendSuccess(res, {}, 'All notifications marked as read');
  } catch (error) {
    console.error('markAllAsRead error:', error);
    return sendError(res, 'Failed to mark all as read', 500);
  }
};

// ── Delete read notifications ──────────────────────────
export const clearReadNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      recipient: req.user.id,
      read: true,
    });

    return sendSuccess(res, {}, 'Read notifications cleared');
  } catch (error) {
    console.error('clearReadNotifications error:', error);
    return sendError(res, 'Failed to clear notifications', 500);
  }
};