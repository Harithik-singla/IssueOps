import Project from '../models/Project.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import Issue from '../models/Issue.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ── Helper — check workspace membership ───────────────
const getMembership = async (workspaceId, userId) => {
  return await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
  });
};

// ── Create Project ─────────────────────────────────────
export const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, deadline, status, color } = req.body;

    if (!name?.trim()) {
      return sendError(res, 'Project name is required', 400);
    }

    // Check user is a member of this workspace
    const membership = await getMembership(workspaceId, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // Only OWNER, ADMIN, MEMBER can create projects
    if (membership.role === 'VIEWER') {
      return sendError(res, 'Viewers cannot create projects', 403);
    }

    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.user.id,
      deadline:  deadline || null,
      status:    status  || 'ACTIVE',
      color:     color   || '#3b82f6',
    });

    await project.populate('createdBy', 'name email');

    return sendSuccess(res, { project }, 'Project created successfully', 201);
  } catch (error) {
    console.error('createProject error:', error);
    return sendError(res, 'Failed to create project', 500);
  }
};

// ── Get all projects in a workspace ───────────────────
export const getProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check membership
    const membership = await getMembership(workspaceId, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    const projects = await Project.find({ workspace: workspaceId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Add issue counts to each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const totalIssues = await Issue.countDocuments({
          project: project._id,
        });
        const completedIssues = await Issue.countDocuments({
          project: project._id,
          status: 'DONE',
        });
        return {
          ...project,
          totalIssues,
          completedIssues,
        };
      })
    );

    return sendSuccess(res, { projects: projectsWithCounts });
  } catch (error) {
    console.error('getProjects error:', error);
    return sendError(res, 'Failed to fetch projects', 500);
  }
};

// ── Get single project ─────────────────────────────────
export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('createdBy', 'name email')
      .populate('workspace', 'name slug')
      .lean();

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Check user is a member of the workspace this project belongs to
    const membership = await getMembership(project.workspace._id, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // Get issue counts
    const totalIssues = await Issue.countDocuments({ project: projectId });
    const completedIssues = await Issue.countDocuments({
      project: projectId,
      status: 'DONE',
    });

    return sendSuccess(res, {
      project: {
        ...project,
        totalIssues,
        completedIssues,
        role: membership.role,
      },
    });
  } catch (error) {
    console.error('getProject error:', error);
    return sendError(res, 'Failed to fetch project', 500);
  }
};

// ── Update Project ─────────────────────────────────────
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, deadline, status, color } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Check membership
    const membership = await getMembership(project.workspace, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // Only OWNER and ADMIN can update projects
    if (!['OWNER', 'ADMIN'].includes(membership.role)) {
      return sendError(res, 'Not authorized to update this project', 403);
    }

    const updated = await Project.findByIdAndUpdate(
      projectId,
      { name, description, deadline, status, color },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    return sendSuccess(res, { project: updated }, 'Project updated successfully');
  } catch (error) {
    console.error('updateProject error:', error);
    return sendError(res, 'Failed to update project', 500);
  }
};

// ── Delete Project ─────────────────────────────────────
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Only OWNER or ADMIN can delete
    const membership = await getMembership(project.workspace, req.user.id);
    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return sendError(res, 'Not authorized to delete this project', 403);
    }

    await Project.findByIdAndDelete(projectId);

    // Delete all issues in this project too
    await Issue.deleteMany({ project: projectId });

    return sendSuccess(res, {}, 'Project deleted successfully');
  } catch (error) {
    console.error('deleteProject error:', error);
    return sendError(res, 'Failed to delete project', 500);
  }
};