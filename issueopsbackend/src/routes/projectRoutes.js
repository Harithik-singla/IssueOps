import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:projectId')
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

export default router;