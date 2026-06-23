import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All workspace routes are protected
router.use(protect);

router.route('/')
  .get(getWorkspaces)
  .post(createWorkspace);

router.route('/:workspaceId')
  .get(getWorkspace)
  .patch(updateWorkspace)
  .delete(deleteWorkspace);

router.route('/:workspaceId/members')
  .get(getMembers);

router.post('/:workspaceId/invite', inviteMember);

router.route('/:workspaceId/members/:memberId/role')
  .patch(updateMemberRole);

router.delete('/:workspaceId/members/:memberId', removeMember);

export default router;