import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ── Helper ─────────────────────────────────────────────
const getMembership = async (workspaceId, userId) => {
  return await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
  });
};

// ── Create Comment ─────────────────────────────────────
export const createComment = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return sendError(res, 'Comment content is required', 400);
    }

    // 1. Find the issue
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // 2. Check membership
    const membership = await getMembership(issue.workspace, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // 3. Viewers cannot comment
    if (membership.role === 'VIEWER') {
      return sendError(res, 'Viewers cannot post comments', 403);
    }

    // 4. Create comment
    const comment = await Comment.create({
      content,
      issue:     issueId,
      author:    req.user.id,
      workspace: issue.workspace,
    });

    // 5. Populate author before responding
    await comment.populate('author', 'name email');

    return sendSuccess(res, { comment }, 'Comment posted successfully', 201);
  } catch (error) {
    console.error('createComment error:', error);
    return sendError(res, 'Failed to post comment', 500);
  }
};

// ── Get all comments for an issue ──────────────────────
export const getComments = async (req, res) => {
  try {
    const { issueId } = req.params;

    // 1. Find the issue
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // 2. Check membership
    const membership = await getMembership(issue.workspace, req.user.id);
    if (!membership) {
      return sendError(res, 'Access denied', 403);
    }

    // 3. Get comments oldest first
    const comments = await Comment.find({ issue: issueId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 })
      .lean();

    return sendSuccess(res, { comments });
  } catch (error) {
    console.error('getComments error:', error);
    return sendError(res, 'Failed to fetch comments', 500);
  }
};

// ── Update Comment ─────────────────────────────────────
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return sendError(res, 'Comment content is required', 400);
    }

    // 1. Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }

    // 2. Only the author can edit their own comment
    if (comment.author.toString() !== req.user.id.toString()) {
      return sendError(res, 'You can only edit your own comments', 403);
    }

    // 3. Update
    comment.content = content;
    await comment.save();
    await comment.populate('author', 'name email');

    return sendSuccess(res, { comment }, 'Comment updated successfully');
  } catch (error) {
    console.error('updateComment error:', error);
    return sendError(res, 'Failed to update comment', 500);
  }
};

// ── Delete Comment ─────────────────────────────────────
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // 1. Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }

    // 2. Author or workspace admin/owner can delete
    const membership = await getMembership(comment.workspace, req.user.id);

    const isAuthor = comment.author.toString() === req.user.id.toString();
    const isAdmin  = membership && ['OWNER', 'ADMIN'].includes(membership.role);

    if (!isAuthor && !isAdmin) {
      return sendError(res, 'Not authorized to delete this comment', 403);
    }

    await Comment.findByIdAndDelete(commentId);

    return sendSuccess(res, {}, 'Comment deleted successfully');
  } catch (error) {
    console.error('deleteComment error:', error);
    return sendError(res, 'Failed to delete comment', 500);
  }
};