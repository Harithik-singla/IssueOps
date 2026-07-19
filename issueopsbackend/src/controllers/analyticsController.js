import mongoose from 'mongoose';
import Issue from '../models/Issue.js';
import Project from '../models/Project.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ── Helper ─────────────────────────────────────────────
const getMembership = async (workspaceId, userId) => {
  return await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
  });
};

// ── Workspace Analytics ────────────────────────────────
export const getWorkspaceAnalytics = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check membership
    const membership = await getMembership(workspaceId, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // ── 1. Issues by status ──────────────────────────
    const issuesByStatus = await Issue.aggregate([
      { $match: { workspace: new mongoose.Types.ObjectId(workspaceId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // ── 2. Issues by priority ────────────────────────
    const issuesByPriority = await Issue.aggregate([
      { $match: { workspace: new mongoose.Types.ObjectId(workspaceId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // ── 3. Issues completed per week (last 6 weeks) ──
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

    const weeklyCompleted = await Issue.aggregate([
      {
        $match: {
          workspace:  new mongoose.Types.ObjectId(workspaceId),
          status:     'DONE',
          updatedAt:  { $gte: sixWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$updatedAt' },
            week: { $isoWeek:     '$updatedAt' },
          },
          completed: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    // ── 4. Member workload ───────────────────────────
    const memberWorkload = await Issue.aggregate([
      {
        $match: {
          workspace: new mongoose.Types.ObjectId(workspaceId),
          assignee:  { $ne: null },
        },
      },
      {
        $group: {
          _id:       '$assignee',
          assigned:  { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from:         'users',
          localField:   '_id',
          foreignField: '_id',
          as:           'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name:      '$user.name',
          assigned:  1,
          completed: 1,
        },
      },
      { $sort: { assigned: -1 } },
    ]);

    // ── 5. Overdue issues by project ─────────────────
    const overdueByProject = await Issue.aggregate([
      {
        $match: {
          workspace: new mongoose.Types.ObjectId(workspaceId),
          dueDate:   { $lt: new Date() },
          status:    { $nin: ['DONE', 'CANCELLED'] },
        },
      },
      {
        $group: {
          _id:    '$project',
          overdue: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from:         'projects',
          localField:   '_id',
          foreignField: '_id',
          as:           'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          project: '$project.name',
          overdue: 1,
        },
      },
      { $sort: { overdue: -1 } },
    ]);

    // ── 6. Summary metrics ───────────────────────────
    const totalIssues = await Issue.countDocuments({
      workspace: workspaceId,
    });

    const completedIssues = await Issue.countDocuments({
      workspace: workspaceId,
      status:    'DONE',
    });

    const blockedIssues = await Issue.countDocuments({
      workspace: workspaceId,
      status:    'BLOCKED',
    });

    const overdueIssues = await Issue.countDocuments({
      workspace: workspaceId,
      dueDate:   { $lt: new Date() },
      status:    { $nin: ['DONE', 'CANCELLED'] },
    });

    const completionRate = totalIssues > 0
      ? Math.round((completedIssues / totalIssues) * 100)
      : 0;

    // Most active member
    const mostActive = memberWorkload[0] || null;

    return sendSuccess(res, {
      issuesByStatus:    issuesByStatus.map(i => ({ name: i._id,  value: i.count })),
      issuesByPriority:  issuesByPriority.map(i => ({ name: i._id, value: i.count })),
      weeklyCompleted:   weeklyCompleted.map(i => ({
        week:      `W${i._id.week}`,
        completed:  i.completed,
      })),
      memberWorkload,
      overdueByProject: overdueByProject.map(i => ({
        project: i.project,
        overdue: i.overdue,
      })),
      metrics: {
        totalIssues,
        completedIssues,
        completionRate,
        blockedCount:      blockedIssues,
        overdueCount:      overdueIssues,
        mostActiveMember:  mostActive?.name || 'N/A',
      },
    });
  } catch (error) {
    console.error('getWorkspaceAnalytics error:', error);
    return sendError(res, 'Failed to fetch analytics', 500);
  }
};

// ── Project Analytics ──────────────────────────────────
export const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    const membership = await getMembership(project.workspace, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // Issues by status
    const issuesByStatus = await Issue.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Issues by priority
    const issuesByPriority = await Issue.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Summary
    const totalIssues = await Issue.countDocuments({ project: projectId });
    const completedIssues = await Issue.countDocuments({
      project: projectId,
      status:  'DONE',
    });
    const overdueIssues = await Issue.countDocuments({
      project: projectId,
      dueDate: { $lt: new Date() },
      status:  { $nin: ['DONE', 'CANCELLED'] },
    });

    return sendSuccess(res, {
      issuesByStatus:   issuesByStatus.map(i => ({ name: i._id, value: i.count })),
      issuesByPriority: issuesByPriority.map(i => ({ name: i._id, value: i.count })),
      metrics: {
        totalIssues,
        completedIssues,
        overdueIssues,
        completionRate: totalIssues > 0
          ? Math.round((completedIssues / totalIssues) * 100)
          : 0,
      },
    });
  } catch (error) {
    console.error('getProjectAnalytics error:', error);
    return sendError(res, 'Failed to fetch project analytics', 500);
  }
};