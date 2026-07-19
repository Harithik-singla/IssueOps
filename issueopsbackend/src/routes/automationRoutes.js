import express from 'express';
import {
  getRules,
  createRule,
  updateRule,
  deleteRule,
} from '../controllers/automationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .get(getRules)
  .post(createRule);

router.route('/:ruleId')
  .patch(updateRule)
  .delete(deleteRule);

export default router;