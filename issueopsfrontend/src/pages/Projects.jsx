import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar } from 'lucide-react';
import { Card, Button, Modal, Input, Textarea, Select, Badge, ProgressBar } from '../components/ui/index';
import { formatDate } from '../utils/formatDate';
import { projectApi } from '../api/projectApi';
import { workspaceApi } from '../api/workspaceApi';
import AppLayout from '../components/layout/AppLayout';
import toast from 'react-hot-toast';

const statusColors = {
  PLANNING:  'bg-purple-50 text-purple-600',
  ACTIVE:    'bg-green-50 text-green-600',
  ON_HOLD:   'bg-amber-50 text-amber-600',
  COMPLETED: 'bg-gray-100 text-gray-500',
};

const statusOptions = [
  { value: 'PLANNING',  label: 'Planning' },
  { value: 'ACTIVE',    label: 'Active' },
  { value: 'ON_HOLD',   label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function Projects() {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', deadline: '',
    status: 'ACTIVE', workspaceId: '',
  });

  // ── Fetch workspaces for selector ────────────────────
  const { data: wsData } = useQuery({
    queryKey: ['workspaces'],
    queryFn:  () => workspaceApi.getAll().then(r => r.data.data.workspaces),
  });
  const workspaces = wsData || [];

  // ── Fetch projects across all workspaces ─────────────
  const { data, isLoading } = useQuery({
    queryKey: ['projects', workspaces.map(w => w._id)],
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

  const projects = data || [];

  // ── Create project ────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: ({ workspaceId, ...rest }) =>
      projectApi.create(workspaceId, rest),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setCreateOpen(false);
      setForm({ name: '', description: '', deadline: '', status: 'ACTIVE', workspaceId: '' });
      toast.success('Project created');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create project');
    },
  });

  const handleCreate = () => {
    if (!form.name.trim() || !form.workspaceId) return;
    const { workspaceId, ...rest } = form;
    createMutation.mutate({ workspaceId, ...rest });
  };

  // Set default workspace when they load
  const openCreate = () => {
    setForm(f => ({ ...f, workspaceId: workspaces[0]?._id || '' }));
    setCreateOpen(true);
  };

  if (isLoading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-400 mt-0.5">{projects.length} projects</p>
          </div>
          <Button onClick={openCreate}><Plus size={14} /> New Project</Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No projects yet. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map(p => {
              const pct = p.totalIssues > 0
                ? Math.round((p.completedIssues / p.totalIssues) * 100)
                : 0;
              return (
                <Card
                  key={p._id}
                  className="p-5 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: p.color || '#3b82f6' }} />
                      <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                    </div>
                    <Badge className={statusColors[p.status] || statusColors.ACTIVE}>
                      {p.status}
                    </Badge>
                  </div>
                  {p.description && (
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2">{p.description}</p>
                  )}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{p.completedIssues || 0} of {p.totalIssues || 0} done</span>
                      <span className="font-medium text-gray-600">{pct}%</span>
                    </div>
                    <ProgressBar value={p.completedIssues || 0} max={p.totalIssues || 1} />
                  </div>
                  {p.deadline && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={11} />
                      <span>Due {formatDate(p.deadline)}</span>
                    </div>
                  )}
                  <Button
                    className="w-full justify-center mt-4"
                    variant="secondary"
                    size="sm"
                    onClick={e => { e.stopPropagation(); navigate(`/projects/${p._id}`); }}
                  >
                    Open Project
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Project">
          <div className="flex flex-col gap-4">
            <Select
              label="Workspace"
              value={form.workspaceId}
              onChange={e => setForm({...form, workspaceId: e.target.value})}
              options={workspaces.map(w => ({ value: w._id, label: w.name }))}
            />
            <Input
              label="Project name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. Backend API"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="What is this project about?"
              rows={3}
            />
            <Input
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => setForm({...form, status: e.target.value})}
              options={statusOptions}
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                onClick={handleCreate}
                disabled={!form.name.trim() || !form.workspaceId || createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}