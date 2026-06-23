import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ── Create Workspace ───────────────────────────────────
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return sendError(res, 'Workspace name is required', 400);
    }

    // 1. Create the workspace
    const workspace = await Workspace.create({
      name,
      description,
      createdBy: req.user.id,
    });

    // 2. Add the creator as OWNER
    await WorkspaceMember.create({
      workspace: workspace._id,
      user:      req.user.id,
      role:      'OWNER',
    });

    return sendSuccess(res, { workspace }, 'Workspace created successfully', 201);
  } catch (error) {
    console.error('createWorkspace error:', error);
    return sendError(res, 'Failed to create workspace', 500);
  }
};

// ── Get all workspaces for current user ────────────────
export const getWorkspaces = async (req, res) => {
  try {
    // Find all memberships for this user
    const memberships = await WorkspaceMember.find({ user: req.user.id })
      .populate('workspace')
      .lean();

    // Shape the response
    const workspaces = memberships.map((m) => ({
      ...m.workspace,
      role: m.role,
      joinedAt: m.createdAt,
    }));

    return sendSuccess(res, { workspaces });
  } catch (error) {
    console.error('getWorkspaces error:', error);
    return sendError(res, 'Failed to fetch workspaces', 500);
  }
};

// ── Get single workspace ───────────────────────────────
export const getWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check user is a member
    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      req.user.id,
    });

    if (!membership) {
      return sendError(res, 'Workspace not found or access denied', 404);
    }

    const workspace = await Workspace.findById(workspaceId)
      .populate('createdBy', 'name email')
      .lean();

    if (!workspace) {
      return sendError(res, 'Workspace not found', 404);
    }

    // Get member count and project count
    const memberCount = await WorkspaceMember.countDocuments({
      workspace: workspaceId,
    });

    return sendSuccess(res, {
      workspace: {
        ...workspace,
        role: membership.role,
        memberCount,
      },
    });
  } catch (error) {
    console.error('getWorkspace error:', error);
    return sendError(res, 'Failed to fetch workspace', 500);
  }
};

// ── Update Workspace ───────────────────────────────────
export const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    // Only OWNER or ADMIN can update
    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      req.user.id,
      role:      { $in: ['OWNER', 'ADMIN'] },
    });

    if (!membership) {
      return sendError(res, 'Not authorized to update this workspace', 403);
    }

    const workspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      { name, description },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, { workspace }, 'Workspace updated successfully');
  } catch (error) {
    console.error('updateWorkspace error:', error);
    return sendError(res, 'Failed to update workspace', 500);
  }
};

// ── Delete Workspace ───────────────────────────────────
export const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Only OWNER can delete
    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      req.user.id,
      role:      'OWNER',
    });

    if (!membership) {
      return sendError(res, 'Only the workspace owner can delete it', 403);
    }

    // Delete workspace and all memberships
    await Workspace.findByIdAndDelete(workspaceId);
    await WorkspaceMember.deleteMany({ workspace: workspaceId });

    return sendSuccess(res, {}, 'Workspace deleted successfully');
  } catch (error) {
    console.error('deleteWorkspace error:', error);
    return sendError(res, 'Failed to delete workspace', 500);
  }
};

// ── Get workspace members ──────────────────────────────
export const getMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check requester is a member
    const requesterMembership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      req.user.id,
    });

    if (!requesterMembership) {
      return sendError(res, 'Access denied', 403);
    }

    const members = await WorkspaceMember.find({ workspace: workspaceId })
      .populate('user', 'name email avatar')
      .lean();

    const shaped = members.map((m) => ({
      id:       m._id,
      user:     m.user,
      role:     m.role,
      joinedAt: m.createdAt,
    }));

    return sendSuccess(res, { members: shaped });
  } catch (error) {
    console.error('getMembers error:', error);
    return sendError(res, 'Failed to fetch members', 500);
  }
};

// ── Invite member ──────────────────────────────────────
export const inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role = 'MEMBER' } = req.body;

    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    // Only OWNER or ADMIN can invite
    const inviterMembership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      req.user.id,
      role:      { $in: ['OWNER', 'ADMIN'] },
    });

    if (!inviterMembership) {
      return sendError(res, 'Not authorized to invite members', 403);
    }

    // Find the user by email
    const User = (await import('../models/User.js')).default;
    const userToInvite = await User.findOne({ email: email.toLowerCase() });

    if (!userToInvite) {
      return sendError(res, 'No user found with that email address', 404);
    }

    // Check if already a member
    const existingMember = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      userToInvite._id,
    });

    if (existingMember) {
      return sendError(res, 'User is already a member of this workspace', 400);
    }

    // Add member
    const member = await WorkspaceMember.create({
      workspace: workspaceId,
      user:      userToInvite._id,
      role,
    });

    await member.populate('user', 'name email avatar');

    return sendSuccess(
      res,
      { member },
      'Member invited successfully',
      201
    );
  } catch (error) {
    console.error('inviteMember error:', error);
    return sendError(res, 'Failed to invite member', 500);
  }
};

// ── Update member role ─────────────────────────────────
export const updateMemberRole = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    const validRoles = ['ADMIN', 'MEMBER', 'VIEWER'];
    if (!validRoles.includes(role)) {
      return sendError(res, 'Invalid role', 400);
    }

    // Only OWNER can change roles
    const requesterMembership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      req.user.id,
      role:      'OWNER',
    });

    if (!requesterMembership) {
      return sendError(res, 'Only the owner can change member roles', 403);
    }

    const member = await WorkspaceMember.findByIdAndUpdate(
      memberId,
      { role },
      { new: true }
    ).populate('user', 'name email');

    if (!member) {
      return sendError(res, 'Member not found', 404);
    }

    return sendSuccess(res, { member }, 'Role updated successfully');
  } catch (error) {
    console.error('updateMemberRole error:', error);
    return sendError(res, 'Failed to update role', 500);
  }
};

// ── Remove member ──────────────────────────────────────
export const removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    // Only OWNER or ADMIN can remove
    const requesterMembership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user:      req.user.id,
      role:      { $in: ['OWNER', 'ADMIN'] },
    });

    if (!requesterMembership) {
      return sendError(res, 'Not authorized to remove members', 403);
    }

    const memberToRemove = await WorkspaceMember.findById(memberId);

    if (!memberToRemove) {
      return sendError(res, 'Member not found', 404);
    }

    // Cannot remove the OWNER
    if (memberToRemove.role === 'OWNER') {
      return sendError(res, 'Cannot remove the workspace owner', 400);
    }

    await WorkspaceMember.findByIdAndDelete(memberId);

    return sendSuccess(res, {}, 'Member removed successfully');
  } catch (error) {
    console.error('removeMember error:', error);
    return sendError(res, 'Failed to remove member', 500);
  }
};