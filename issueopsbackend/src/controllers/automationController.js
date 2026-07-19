import AutomationRule from '../models/AutomationRule.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const getMembership = async (workspaceId, userId) => {
  return await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
  });
};

// ── Get all rules ──────────────────────────────────────
export const getRules = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const membership = await getMembership(workspaceId, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    const rules = await AutomationRule.find({ workspace: workspaceId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, { rules });
  } catch (error) {
    console.error('getRules error:', error);
    return sendError(res, 'Failed to fetch rules', 500);
  }
};

// ── Create rule ────────────────────────────────────────
export const createRule = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const {
      name,
      trigger,
      conditionField,
      conditionOperator,
      conditionValue,
      actionType,
      actionTarget,
      enabled,
    } = req.body;

    // Only OWNER or ADMIN can create rules
    const membership = await getMembership(workspaceId, req.user.id);
    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return sendError(res, 'Not authorized to create automation rules', 403);
    }

    const rule = await AutomationRule.create({
      name,
      workspace: workspaceId,
      createdBy: req.user.id,
      trigger,
      conditionField,
      conditionOperator,
      conditionValue,
      actionType,
      actionTarget,
      enabled: enabled ?? true,
    });

    return sendSuccess(res, { rule }, 'Automation rule created', 201);
  } catch (error) {
    console.error('createRule error:', error);
    return sendError(res, 'Failed to create rule', 500);
  }
};

// ── Update rule ────────────────────────────────────────
export const updateRule = async (req, res) => {
  try {
    const { ruleId } = req.params;

    const rule = await AutomationRule.findById(ruleId);
    if (!rule) {
      return sendError(res, 'Rule not found', 404);
    }

    const membership = await getMembership(rule.workspace, req.user.id);
    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return sendError(res, 'Not authorized', 403);
    }

    const updated = await AutomationRule.findByIdAndUpdate(
      ruleId,
      { ...req.body },
      { returnDocument: 'after', runValidators: true }
    );

    return sendSuccess(res, { rule: updated }, 'Rule updated successfully');
  } catch (error) {
    console.error('updateRule error:', error);
    return sendError(res, 'Failed to update rule', 500);
  }
};

// ── Delete rule ────────────────────────────────────────
export const deleteRule = async (req, res) => {
  try {
    const { ruleId } = req.params;

    const rule = await AutomationRule.findById(ruleId);
    if (!rule) {
      return sendError(res, 'Rule not found', 404);
    }

    const membership = await getMembership(rule.workspace, req.user.id);
    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return sendError(res, 'Not authorized', 403);
    }

    await AutomationRule.findByIdAndDelete(ruleId);

    return sendSuccess(res, {}, 'Rule deleted successfully');
  } catch (error) {
    console.error('deleteRule error:', error);
    return sendError(res, 'Failed to delete rule', 500);
  }
};