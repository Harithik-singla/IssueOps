import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { Card, Button, Tabs, Avatar, Textarea } from '../components/ui/index';
import { StatusBadge, PriorityBadge, TypeBadge, LabelBadge } from '../components/ui/StatusBadges';
import { formatDateTime, formatTimeAgo } from '../utils/formatDate';
import { issueApi } from '../api/issueApi';
import { commentApi } from '../api/commentApi';
import { ISSUE_STATUS, ISSUE_PRIORITY } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import toast from 'react-hot-toast';

const statusOpts   = Object.keys(ISSUE_STATUS).map(s   => ({ value: s, label: s.replace(/_/g, ' ') }));
const priorityOpts = Object.keys(ISSUE_PRIORITY).map(p => ({ value: p, label: p }));

function MetaRow({ label, children }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50">
      <span className="text-xs text-gray-400 w-24 flex-shrink-0 pt-0.5">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function IssueDetail() {
  const { id }        = useParams();
  const { user }      = useAuth();
  const queryClient   = useQueryClient();
  const [tab, setTab] = useState('comments');
  const [comment, setComment] = useState('');

  // ── Fetch issue ───────────────────────────────────────
  const { data: issueData, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn:  () => issueApi.getById(id).then(r => r.data.data.issue),
  });
  const issue = issueData;

  // ── Fetch comments ────────────────────────────────────
  const { data: commentsData } = useQuery({
    queryKey: ['comments', id],
    queryFn:  () => commentApi.getByIssue(id).then(r => r.data.data.comments),
    enabled:  !!id,
  });
  const comments = commentsData || [];

  // ── Update status ─────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: (status) => issueApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['issue', id]);
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  // ── Update issue field ────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (updates) => issueApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['issue', id]);
      toast.success('Issue updated');
    },
    onError: () => toast.error('Failed to update issue'),
  });

  // ── Post comment ──────────────────────────────────────
  const commentMutation = useMutation({
    mutationFn: (content) => commentApi.create(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
      setComment('');
      toast.success('Comment posted');
    },
    onError: () => toast.error('Failed to post comment'),
  });

  // ── Delete comment ────────────────────────────────────
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => commentApi.delete(commentId),
    onSuccess:  () => queryClient.invalidateQueries(['comments', id]),
  });

  if (isLoading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  if (!issue) return (
    <AppLayout>
      <div className="text-center py-16 text-gray-400">Issue not found.</div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/issues" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <ArrowLeft size={16} />
          </Link>
          <span className="text-xs text-gray-400 font-mono">{issue._id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-3">{issue.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <StatusBadge   status={issue.status} />
                <PriorityBadge priority={issue.priority} />
                <TypeBadge     type={issue.type} />
                {issue.labels?.map(l => <LabelBadge key={l} label={l} />)}
              </div>
              {issue.description && (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {issue.description}
                </p>
              )}
            </Card>

            {/* Tabs */}
            <Card className="overflow-hidden">
              <div className="px-6 pt-4">
                <Tabs
                  tabs={[
                    { id: 'comments',    label: 'Comments',    count: comments.length },
                    { id: 'attachments', label: 'Attachments', count: 0 },
                  ]}
                  active={tab}
                  onChange={setTab}
                />
              </div>
              <div className="p-6">
                {tab === 'comments' && (
                  <div className="space-y-4">
                    {comments.length === 0 && (
                      <p className="text-xs text-gray-400 py-4 text-center">
                        No comments yet.
                      </p>
                    )}
                    {comments.map(c => (
                      <div key={c._id} className="flex gap-3">
                        <Avatar user={c.author} size="sm" />
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">
                              {c.author?.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {formatTimeAgo(c.createdAt)}
                              </span>
                              {c.author?._id === user?.id && (
                                <button
                                  onClick={() => deleteCommentMutation.mutate(c._id)}
                                  className="text-xs text-red-400 hover:text-red-600"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Comment box */}
                    <div className="flex gap-3 pt-2">
                      <Avatar user={user} size="sm" />
                      <div className="flex-1">
                        <Textarea
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          placeholder="Add a comment…"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={() => commentMutation.mutate(comment)}
                            disabled={!comment.trim() || commentMutation.isPending}
                          >
                            <Send size={12} />
                            {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'attachments' && (
                  <div className="text-center py-8">
                    <Paperclip size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No attachments</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Details
              </h3>
              <div className="divide-y divide-gray-50">
                <MetaRow label="Status">
                  <select
                    value={issue.status}
                    onChange={e => statusMutation.mutate(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                  >
                    {statusOpts.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </MetaRow>

                <MetaRow label="Priority">
                  <select
                    value={issue.priority}
                    onChange={e => updateMutation.mutate({ priority: e.target.value })}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                  >
                    {priorityOpts.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </MetaRow>

                <MetaRow label="Assignee">
                  {issue.assignee
                    ? <div className="flex items-center gap-1.5">
                        <Avatar user={issue.assignee} size="xs" />
                        <span className="text-xs text-gray-600">{issue.assignee.name}</span>
                      </div>
                    : <span className="text-xs text-gray-300">Unassigned</span>
                  }
                </MetaRow>

                <MetaRow label="Reporter">
                  <div className="flex items-center gap-1.5">
                    <Avatar user={issue.reporter} size="xs" />
                    <span className="text-xs text-gray-600">{issue.reporter?.name}</span>
                  </div>
                </MetaRow>

                <MetaRow label="Due Date">
                  <input
                    type="date"
                    defaultValue={issue.dueDate?.split('T')[0] || ''}
                    onBlur={e => updateMutation.mutate({ dueDate: e.target.value })}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                  />
                </MetaRow>

                <MetaRow label="Labels">
                  <div className="flex flex-wrap gap-1">
                    {issue.labels?.length > 0
                      ? issue.labels.map(l => <LabelBadge key={l} label={l} />)
                      : <span className="text-xs text-gray-300">No labels</span>
                    }
                  </div>
                </MetaRow>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Timestamps
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-400">Created</p>
                  <p className="text-xs text-gray-600 mt-0.5">{formatDateTime(issue.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="text-xs text-gray-600 mt-0.5">{formatDateTime(issue.updatedAt)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}