import express from 'express';
import {
  getWorkspaceAnalytics,
  getProjectAnalytics,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/workspaces/:workspaceId', getWorkspaceAnalytics);
router.get('/projects/:projectId',     getProjectAnalytics);

export default router;