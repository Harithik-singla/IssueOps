import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Paperclip, Activity, Send, Edit2, Trash2 } from 'lucide-react';
import { Card, Button, Tabs, Avatar, Badge, Textarea, Select } from '../components/ui/index';
import { StatusBadge, PriorityBadge, TypeBadge, LabelBadge } from '../components/ui/StatusBadges';
import { formatDateTime, formatTimeAgo } from '../utils/formatDate';
import { mockIssues, mockComments, mockActivity, mockUsers, mockProjects } from '../data/mockData';
import { ISSUE_STATUS, ISSUE_PRIORITY } from '../utils/constants';
import AppLayout from '../components/layout/AppLayout';

const statusOpts   = Object.keys(ISSUE_STATUS).map(s => ({ value: s, label: s.replace(/_/g, ' ') }));
const priorityOpts = Object.keys(ISSUE_PRIORITY).map(p => ({ value: p, label: p }));
const assigneeOpts = mockUsers.map(u => ({ value: u.id, label: u.name }));

function MetaRow({ label, children }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50">
      <span className="text-xs text-gray-400 w-24 flex-shrink-0 pt-0.5">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(mockIssues.find(i => i.id === id) || mockIssues[0]);
  const [comments, setComments] = useState(mockComments.filter(c => c.issueId === (id || mockIssues[0].id)));
  const [activity] = useState(mockActivity.filter(a => a.issueId === (id || mockIssues[0].id)));
  const [tab, setTab] = useState('comments');
  const [comment, setComment] = useState('');
  const project = mockProjects.find(p => p.id === issue.projectId);

  const postComment = () => {
    if (!comment.trim()) return;
    const c = { id: `c${Date.now()}`, issueId: issue.id, author: mockUsers[0], content: comment, createdAt: new Date().toISOString() };
    setComments([...comments, c]);
    setComment('');
  };

  const updateIssue = (field, value) => {
    setIssue({ ...issue, [field]: value });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/issues" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {project && <Link to={`/projects/${project.id}`} className="hover:text-blue-500">{project.name}</Link>}
            <span>/</span>
            <span className="font-mono text-gray-500">{issue.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{issue.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
                <TypeBadge type={issue.type} />
                {issue.labels.map(l => <LabelBadge key={l} label={l} />)}
              </div>
              {issue.description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{issue.description}</p>
                </div>
              )}
            </Card>

            {/* Tabs */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 pt-4">
                <Tabs
                  tabs={[
                    { id: 'comments', label: 'Comments', count: comments.length },
                    { id: 'activity', label: 'Activity', count: activity.length },
                    { id: 'attachments', label: 'Attachments', count: 0 },
                  ]}
                  active={tab}
                  onChange={setTab}
                />
              </div>

              <div className="p-6">
                {/* Comments */}
                {tab === 'comments' && (
                  <div className="space-y-4">
                    {comments.length === 0 && (
                      <p className="text-xs text-gray-400 py-4 text-center">No comments yet. Be the first to comment.</p>
                    )}
                    {comments.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <Avatar user={c.author} size="sm" />
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">{c.author.name}</span>
                            <span className="text-xs text-gray-400">{formatTimeAgo(c.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                    ))}
                    {/* Comment box */}
                    <div className="flex gap-3 pt-2">
                      <Avatar user={mockUsers[0]} size="sm" />
                      <div className="flex-1">
                        <Textarea
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          placeholder="Add a comment… Use @name to mention"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button size="sm" onClick={postComment} disabled={!comment.trim()}>
                            <Send size={12} /> Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity */}
                {tab === 'activity' && (
                  <div className="space-y-3">
                    {activity.length === 0
                      ? <p className="text-xs text-gray-400 py-4 text-center">No activity yet.</p>
                      : activity.map(a => (
                          <div key={a.id} className="flex items-start gap-3">
                            <Avatar user={a.actor} size="xs" />
                            <div>
                              <p className="text-xs text-gray-700">
                                <span className="font-medium">{a.actor.name}</span> {a.action}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(a.createdAt)}</p>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                )}

                {/* Attachments */}
                {tab === 'attachments' && (
                  <div className="text-center py-8">
                    <Paperclip size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No attachments</p>
                    <p className="text-xs text-gray-300 mt-1">Connect your backend to enable file uploads.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar meta */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</h3>
              <div className="divide-y divide-gray-50">
                <MetaRow label="Status">
                  <select value={issue.status} onChange={e => updateIssue('status', e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    {statusOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </MetaRow>
                <MetaRow label="Priority">
                  <select value={issue.priority} onChange={e => updateIssue('priority', e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    {priorityOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </MetaRow>
                <MetaRow label="Assignee">
                  <select value={issue.assignee?.id || ''} onChange={e => { const u = mockUsers.find(u => u.id === e.target.value); updateIssue('assignee', u || null); }} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white w-full">
                    <option value="">Unassigned</option>
                    {assigneeOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </MetaRow>
                <MetaRow label="Reporter">
                  <div className="flex items-center gap-1.5">
                    <Avatar user={issue.reporter} size="xs" />
                    <span className="text-xs text-gray-600">{issue.reporter?.name}</span>
                  </div>
                </MetaRow>
                <MetaRow label="Due Date">
                  <input type="date" value={issue.dueDate?.split('T')[0] || ''} onChange={e => updateIssue('dueDate', e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white" />
                </MetaRow>
                <MetaRow label="Labels">
                  <div className="flex flex-wrap gap-1">
                    {issue.labels.map(l => <LabelBadge key={l} label={l} />)}
                    {issue.labels.length === 0 && <span className="text-xs text-gray-300">No labels</span>}
                  </div>
                </MetaRow>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Timestamps</h3>
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
