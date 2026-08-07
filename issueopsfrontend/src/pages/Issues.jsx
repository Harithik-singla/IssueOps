import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Card, Button, Modal, Input, Textarea, Select, Avatar, EmptyState } from '../components/ui/index';
import { StatusBadge, PriorityBadge, TypeBadge, LabelBadge } from '../components/ui/StatusBadges';
import { formatDate } from '../utils/formatDate';
import { issueApi } from '../api/issueApi';
import { projectApi } from '../api/projectApi';
import { workspaceApi } from '../api/workspaceApi';
import { ISSUE_STATUS, ISSUE_PRIORITY, ISSUE_TYPE } from '../utils/constants';
import AppLayout from '../components/layout/AppLayout';
import toast from 'react-hot-toast';

const statusOpts   = [{ value: '', label: 'All Statuses' },   ...Object.keys(ISSUE_STATUS).map(s   => ({ value: s, label: s.replace(/_/g, ' ') }))];
const priorityOpts = [{ value: '', label: 'All Priorities' }, ...Object.keys(ISSUE_PRIORITY).map(p => ({ value: p, label: p }))];
const typeOpts     = [{ value: '', label: 'All Types' },      ...Object.keys(ISSUE_TYPE).map(t     => ({ value: t, label: t }))];

const initialForm = {
  title: '', description: '', projectId: '',
  status: 'TODO', priority: 'MEDIUM', type: 'TASK',
  assigneeId: '', dueDate: '', labels: '',
};

export default function Issues() {
  const queryClient = useQueryClient();
  const [search,     setSearch]     = useState('');
  const [filters,    setFilters]    = useState({ status: '', priority: '', type: '' });
  const [sort,       setSort]       = useState('updatedAt');
  const [createOpen, setCreateOpen] = useState(false);
  const [form,       setForm]       = useState(initialForm);

  // ── Fetch workspaces → projects → issues ─────────────
  const { data: wsData } = useQuery({
    queryKey: ['workspaces'],
    queryFn:  () => workspaceApi.getAll().then(r => r.data.data.workspaces),
  });
  const workspaces = wsData || [];

  const { data: projectsData } = useQuery({
    queryKey: ['all-projects'],
    enabled:  workspaces.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        workspaces.map(ws =>
          projectApi.getByWorkspace(ws._id).then(r => r.data.data.projects)
        )
      );
      return results.flat();
    },
  });
  const projects = projectsData || [];

  const { data: issuesData, isLoading } = useQuery({
    queryKey: ['all-issues', filters, sort, search],
    enabled:  projects.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        projects.map(p =>
          issueApi.getByProject(p._id, {
            status:   filters.status   || undefined,
            priority: filters.priority || undefined,
            type:     filters.type     || undefined,
            sort,
            search:   search           || undefined,
          }).then(r => r.data.data.issues)
        )
      );
      return results.flat();
    },
  });
  const issues = issuesData || [];

  // ── Create issue ──────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: ({ projectId, ...rest }) => issueApi.create(projectId, rest),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-issues']);
      setCreateOpen(false);
      setForm(initialForm);
      toast.success('Issue created');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create issue');
    },
  });

  const handleCreate = () => {
    if (!form.title.trim() || !form.projectId) return;
    createMutation.mutate({
      projectId:   form.projectId,
      title:       form.title,
      description: form.description,
      status:      form.status,
      priority:    form.priority,
      type:        form.type,
      assignee:    form.assigneeId || null,
      dueDate:     form.dueDate    || null,
      labels:      form.labels ? form.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
    });
  };

  // Set default project when opening modal
  const openCreate = () => {
    setForm(f => ({ ...f, projectId: projects[0]?._id || '' }));
    setCreateOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Issues</h1>
            <p className="text-sm text-gray-400 mt-0.5">{issues.length} issues</p>
          </div>
          <Button onClick={openCreate}><Plus size={14} /> New Issue</Button>
        </div>

        {/* Filters */}
        <Card className="p-3">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-1.5 border border-gray-200 rounded-lg bg-white">
              <Search size={13} className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search issues…"
                className="text-sm flex-1 outline-none bg-transparent"
              />
            </div>
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              {statusOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              {priorityOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="updatedAt">Last Updated</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </Card>

        {/* Table */}
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : issues.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No issues found"
              description="Try adjusting your filters or create a new issue."
              action={<Button size="sm" onClick={openCreate}><Plus size={12} />New Issue</Button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Issue', 'Status', 'Priority', 'Type', 'Assignee', 'Due Date', 'Updated'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {issues.map(i => (
                    <tr key={i._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <Link to={`/issues/${i._id}`} className="block">
                          <p className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate">{i.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {i.labels?.slice(0, 2).map(l => <LabelBadge key={l} label={l} />)}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={i.priority} /></td>
                      <td className="px-4 py-3"><TypeBadge type={i.type} /></td>
                      <td className="px-4 py-3">
                        {i.assignee
                          ? <div className="flex items-center gap-1.5">
                              <Avatar user={i.assignee} size="xs" />
                              <span className="text-xs text-gray-600">{i.assignee.name?.split(' ')[0]}</span>
                            </div>
                          : <span className="text-xs text-gray-300">Unassigned</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(i.dueDate)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(i.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Create modal */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Issue" width="max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Title"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="Short descriptive title"
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Description"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Describe the issue…"
                rows={3}
              />
            </div>
            <Select
              label="Project"
              value={form.projectId}
              onChange={e => setForm({...form, projectId: e.target.value})}
              options={projects.map(p => ({ value: p._id, label: p.name }))}
            />
            <Select
              label="Type"
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
              options={typeOpts.filter(o => o.value)}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => setForm({...form, status: e.target.value})}
              options={statusOpts.filter(o => o.value)}
            />
            <Select
              label="Priority"
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
              options={priorityOpts.filter(o => o.value)}
            />
            <Input
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={e => setForm({...form, dueDate: e.target.value})}
            />
            <div className="sm:col-span-2">
              <Input
                label="Labels (comma-separated)"
                value={form.labels}
                onChange={e => setForm({...form, labels: e.target.value})}
                placeholder="e.g. backend, bug, auth"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={!form.title.trim() || !form.projectId || createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Issue'}
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}