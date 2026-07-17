import express from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// Issue-scoped routes
router.route('/')
  .get(getComments)
  .post(createComment);

// Single comment routes
router.route('/:commentId')
  .patch(updateComment)
  .delete(deleteComment);

export default router;