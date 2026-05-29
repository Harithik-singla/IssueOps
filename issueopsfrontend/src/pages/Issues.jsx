import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SortAsc, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, Button, Modal, Input, Textarea, Select, Avatar, EmptyState } from '../components/ui/index';
import { StatusBadge, PriorityBadge, TypeBadge, LabelBadge } from '../components/ui/StatusBadges';
import { formatDate } from '../utils/formatDate';
import { mockIssues, mockUsers, mockProjects } from '../data/mockData';
import { ISSUE_STATUS, ISSUE_PRIORITY, ISSUE_TYPE } from '../utils/constants';
import AppLayout from '../components/layout/AppLayout';

const statusOpts  = [{ value: '', label: 'All Statuses' }, ...Object.keys(ISSUE_STATUS).map(s => ({ value: s, label: s.replace('_', ' ') }))];
const priorityOpts= [{ value: '', label: 'All Priorities' }, ...Object.keys(ISSUE_PRIORITY).map(p => ({ value: p, label: p }))];
const assigneeOpts= [{ value: '', label: 'All Assignees' }, ...mockUsers.map(u => ({ value: u.id, label: u.name }))];
const typeOpts    = [{ value: '', label: 'All Types' }, ...Object.keys(ISSUE_TYPE).map(t => ({ value: t, label: t }))];
const projectOpts = [{ value: '', label: 'All Projects' }, ...mockProjects.map(p => ({ value: p.id, label: p.name }))];

const initialForm = { title: '', description: '', projectId: 'p1', status: 'TODO', priority: 'MEDIUM', type: 'TASK', assigneeId: '', dueDate: '', labels: '' };

export default function Issues() {
  const [issues, setIssues] = useState(mockIssues);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', assignee: '', type: '' });
  const [sort, setSort] = useState('updatedAt');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const filtered = useMemo(() => {
    return issues
      .filter(i => {
        if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.id.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.status && i.status !== filters.status) return false;
        if (filters.priority && i.priority !== filters.priority) return false;
        if (filters.assignee && i.assignee?.id !== filters.assignee) return false;
        if (filters.type && i.type !== filters.type) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sort === 'priority') {
          const p = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return (p[a.priority] || 99) - (p[b.priority] || 99);
        }
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }, [issues, search, filters, sort]);

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const assignee = form.assigneeId ? mockUsers.find(u => u.id === form.assigneeId) : null;
    const n = {
      id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      projectId: form.projectId,
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      type: form.type,
      assignee,
      reporter: mockUsers[0],
      dueDate: form.dueDate || null,
      labels: form.labels ? form.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIssues([n, ...issues]);
    setForm(initialForm);
    setCreateOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Issues</h1>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} of {issues.length} issues</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}><Plus size={14} /> New Issue</Button>
        </div>

        {/* Filters */}
        <Card className="p-3">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-1.5 border border-gray-200 rounded-lg bg-white">
              <Search size={13} className="text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search issues…" className="text-sm flex-1 outline-none bg-transparent" />
            </div>
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              {statusOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              {priorityOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filters.assignee} onChange={e => setFilters({...filters, assignee: e.target.value})} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
              {assigneeOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
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
          {filtered.length === 0
            ? <EmptyState icon={Search} title="No issues found" description="Try adjusting your filters or create a new issue." action={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={12} />New Issue</Button>} />
            : <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Issue', 'Status', 'Priority', 'Type', 'Assignee', 'Due Date', 'Updated', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(i => (
                      <tr key={i.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3 max-w-xs">
                          <Link to={`/issues/${i.id}`} className="block">
                            <p className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate">{i.title}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-gray-300 font-mono">{i.id}</span>
                              {i.labels.slice(0, 2).map(l => <LabelBadge key={l} label={l} />)}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={i.status} /></td>
                        <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge priority={i.priority} /></td>
                        <td className="px-4 py-3 whitespace-nowrap"><TypeBadge type={i.type} /></td>
                        <td className="px-4 py-3">
                          {i.assignee
                            ? <div className="flex items-center gap-1.5"><Avatar user={i.assignee} size="xs" /><span className="text-xs text-gray-600">{i.assignee.name.split(' ')[0]}</span></div>
                            : <span className="text-xs text-gray-300">Unassigned</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(i.dueDate)}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(i.updatedAt)}</td>
                        <td className="px-4 py-3">
                          <button className="p-1 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all">
                            <MoreHorizontal size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </Card>

        {/* Create modal */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Issue" width="max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Short, descriptive issue title" />
            </div>
            <div className="sm:col-span-2">
              <Textarea label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the issue in detail…" rows={4} />
            </div>
            <Select label="Project" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} options={projectOpts.filter(o => o.value)} />
            <Select label="Type" value={form.type} onChange={e => setForm({...form, type: e.target.value})} options={typeOpts.filter(o => o.value)} />
            <Select label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} options={statusOpts.filter(o => o.value)} />
            <Select label="Priority" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} options={priorityOpts.filter(o => o.value)} />
            <Select label="Assignee" value={form.assigneeId} onChange={e => setForm({...form, assigneeId: e.target.value})} options={assigneeOpts} />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
            <div className="sm:col-span-2">
              <Input label="Labels (comma-separated)" value={form.labels} onChange={e => setForm({...form, labels: e.target.value})} placeholder="e.g. backend, bug, auth" />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.title.trim()}>Create Issue</Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
