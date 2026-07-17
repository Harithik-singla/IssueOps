import Issue from '../models/Issue.js';
import Project from '../models/Project.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import {createAssignmentNotification,createStatusChangeNotification} from '../utils/notificationService.js';
// ── Helper — check workspace membership ───────────────
const getMembership = async (workspaceId, userId) => {
  return await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
  });
};

// ── Create Issue ───────────────────────────────────────
export const createIssue = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      description,
      status,
      priority,
      type,
      assignee,
      dueDate,
      labels,
    } = req.body;

    // 1. Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // 2. Check membership
    const membership = await getMembership(project.workspace, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // 3. Viewers cannot create issues
    if (membership.role === 'VIEWER') {
      return sendError(res, 'Viewers cannot create issues', 403);
    }

    // 4. Create the issue
    const issue = await Issue.create({
      title,
      description,
      project:   projectId,
      workspace: project.workspace,
      status:    status   || 'TODO',
      priority:  priority || 'MEDIUM',
      type:      type     || 'TASK',
      assignee:  assignee || null,
      reporter:  req.user.id,
      dueDate:   dueDate  || null,
      labels:    labels   || [],
    });

    // 5. Populate before sending response
    await issue.populate([
      { path: 'assignee', select: 'name email' },
      { path: 'reporter', select: 'name email' },
      { path: 'project',  select: 'name color' },
    ]);

    if (issue.assignee && issue.assignee._id) {
        await createAssignmentNotification({
        assignee:   issue.assignee._id,
        triggeredBy: { _id: req.user.id, name: req.user.name },
        workspace:  issue.workspace,
        issue:      issue._id,
        issueTitle: issue.title,
        });
    }
    return sendSuccess(res, { issue }, 'Issue created successfully', 201);
  } catch (error) {
    console.error('createIssue error:', error);
    return sendError(res, 'Failed to create issue', 500);
  }
};

// ── Get all issues in a project ────────────────────────
export const getIssues = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // 2. Check membership
    const membership = await getMembership(project.workspace, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // 3. Build query filters from query params
    const filter = { project: projectId };

    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignee) filter.assignee = req.query.assignee;
    if (req.query.type)     filter.type     = req.query.type;

    // Search by title
    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: 'i',
      };
    }

    // 4. Build sort
    const sortMap = {
      dueDate:   { dueDate:   1 },
      priority:  { priority:  1 },
      updatedAt: { updatedAt: -1 },
      createdAt: { createdAt: -1 },
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };

    // 5. Query
    const issues = await Issue.find(filter)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email')
      .sort(sort)
      .lean();

    // 6. Add comment count to each issue
    const Comment = (await import('../models/Comment.js')).default;
    const issuesWithCount = await Promise.all(
      issues.map(async (issue) => {
        const commentCount = await Comment.countDocuments({ issue: issue._id });
        return { ...issue, commentCount };
      })
    );

    return sendSuccess(res, { issues: issuesWithCount });
  } catch (error) {
    console.error('getIssues error:', error);
    return sendError(res, 'Failed to fetch issues', 500);
  }
};

// ── Get single issue ───────────────────────────────────
export const getIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId)
      .populate('assignee',  'name email')
      .populate('reporter',  'name email')
      .populate('project',   'name color workspace')
      .populate('workspace', 'name slug')
      .lean();

    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Check membership
    const membership = await getMembership(issue.workspace._id, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // Get comment count
    const Comment = (await import('../models/Comment.js')).default;
    const commentCount = await Comment.countDocuments({ issue: issueId });

    return sendSuccess(res, {
      issue: { ...issue, commentCount },
    });
  } catch (error) {
    console.error('getIssue error:', error);
    return sendError(res, 'Failed to fetch issue', 500);
  }
};

// ── Update Issue ───────────────────────────────────────
export const updateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const updates = req.body;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Check membership
    const membership = await getMembership(issue.workspace, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    if (membership.role === 'VIEWER') {
      return sendError(res, 'Viewers cannot edit issues', 403);
    }

    const updated = await Issue.findByIdAndUpdate(
      issueId,
      { ...updates },
      { new: true, runValidators: true }
    )
      .populate('assignee', 'name email')
      .populate('reporter', 'name email');
      
    // Notify reporter and assignee about status change
    
    return sendSuccess(res, { issue: updated }, 'Issue updated successfully');
  } catch (error) {
    console.error('updateIssue error:', error);
    return sendError(res, 'Failed to update issue', 500);
  }
};

// ── Update Issue Status ────────────────────────────────
export const updateIssueStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'BACKLOG', 'TODO', 'IN_PROGRESS',
      'IN_REVIEW', 'BLOCKED', 'DONE', 'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status value', 400);
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Check membership
    const membership = await getMembership(issue.workspace, req.user.id);
    if (!membership || membership.role === 'VIEWER') {
      return sendError(res, 'Access denied', 403);
    }

    const oldStatus = issue.status;

    const updated = await Issue.findByIdAndUpdate(
      issueId,
      { status },
      { new: true }
    )
      .populate('assignee', 'name email')
      .populate('reporter', 'name email');

      const recipients = [];
    if (updated.reporter) recipients.push(updated.reporter._id);
    if (updated.assignee) recipients.push(updated.assignee._id);

    await Promise.all(
    recipients.map((recipientId) =>
        createStatusChangeNotification({
        recipient:   recipientId,
        triggeredBy: { _id: req.user.id, name: req.user.name },
        workspace:   updated.workspace,
        issue:       updated._id,
        issueTitle:  updated.title,
        oldStatus,
        newStatus:   status,
        })
    )
    );
    return sendSuccess(
      res,
      { issue: updated, oldStatus },
      'Status updated successfully'
    );
  } catch (error) {
    console.error('updateIssueStatus error:', error);
    return sendError(res, 'Failed to update status', 500);
  }
};

// ── Delete Issue ───────────────────────────────────────
export const deleteIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Only OWNER or ADMIN can delete issues
    const membership = await getMembership(issue.workspace, req.user.id);
    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return sendError(res, 'Not authorized to delete this issue', 403);
    }

    await Issue.findByIdAndDelete(issueId);

    // Delete related comments
    const Comment = (await import('../models/Comment.js')).default;
    await Comment.deleteMany({ issue: issueId });

    return sendSuccess(res, {}, 'Issue deleted successfully');
  } catch (error) {
    console.error('deleteIssue error:', error);
    return sendError(res, 'Failed to delete issue', 500);
  }
};

// ── Get all issues across workspace (for Kanban) ───────
export const getWorkspaceIssues = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const membership = await getMembership(workspaceId, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    const filter = { workspace: workspaceId };
    if (req.query.projectId) filter.project  = req.query.projectId;
    if (req.query.status)    filter.status   = req.query.status;
    if (req.query.assignee)  filter.assignee = req.query.assignee;

    const issues = await Issue.find(filter)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email')
      .populate('project',  'name color')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return sendSuccess(res, { issues });
  } catch (error) {
    console.error('getWorkspaceIssues error:', error);
    return sendError(res, 'Failed to fetch issues', 500);
  }
};