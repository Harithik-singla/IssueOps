import express from 'express';
import {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getWorkspaceIssues,
} from '../controllers/issueController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// Project-scoped routes
router.route('/')
  .get(getIssues)
  .post(createIssue);

// Workspace-scoped route (for Kanban)
router.get('/workspace/:workspaceId', getWorkspaceIssues);

// Single issue routes
router.route('/:issueId')
  .get(getIssue)
  .patch(updateIssue)
  .delete(deleteIssue);

router.patch('/:issueId/status', updateIssueStatus);

export default router;