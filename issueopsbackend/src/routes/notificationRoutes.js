import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearReadNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/',           getNotifications);
router.patch('/read-all', markAllAsRead);
router.delete('/clear',   clearReadNotifications);
router.patch('/:notificationId/read', markAsRead);

export default router;