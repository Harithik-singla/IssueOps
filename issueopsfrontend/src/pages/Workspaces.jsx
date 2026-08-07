import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FolderOpen, Users, Calendar } from 'lucide-react';
import { Card, Button, Modal, Input, Textarea, Badge } from '../components/ui/index';
import { roleColors } from '../utils/statusColors';
import { formatDate } from '../utils/formatDate';
import { workspaceApi } from '../api/workspaceApi';
import AppLayout from '../components/layout/AppLayout';
import toast from 'react-hot-toast';

export default function Workspaces() {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  // ── Fetch workspaces ─────────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn:  () => workspaceApi.getAll().then(r => r.data.data.workspaces),
  });

  const workspaces = data || [];

  // ── Create workspace ─────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (formData) => workspaceApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces']);
      setCreateOpen(false);
      setForm({ name: '', description: '' });
      toast.success('Workspace created');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create workspace');
    },
  });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createMutation.mutate(form);
  };

  if (isLoading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="text-center py-16 text-red-500">
        Failed to load workspaces. Please try again.
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New Workspace
          </Button>
        </div>

        {workspaces.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No workspaces yet.</p>
            <Button className="mt-4" onClick={() => setCreateOpen(true)}>
              <Plus size={14} /> Create your first workspace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map(ws => (
              <Card
                key={ws._id}
                className="p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/workspaces/${ws._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {ws.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{ws.name}</h3>
                      <Badge className={`${roleColors[ws.role]?.bg} ${roleColors[ws.role]?.text} mt-0.5 text-[10px]`}>
                        {ws.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                {ws.description && (
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{ws.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users size={12} />{ws.memberCount || 1} members
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Calendar size={12} />{formatDate(ws.createdAt)}
                  </span>
                </div>
                <Button
                  className="w-full justify-center mt-4"
                  variant="secondary"
                  size="sm"
                  onClick={e => { e.stopPropagation(); navigate(`/workspaces/${ws._id}`); }}
                >
                  Open Workspace
                </Button>
              </Card>
            ))}
          </div>
        )}

        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Workspace">
          <div className="flex flex-col gap-4">
            <Input
              label="Workspace name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. Water Quality Team"
            />
            <Textarea
              label="Description (optional)"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="What does this workspace cover?"
              rows={3}
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                onClick={handleCreate}
                disabled={!form.name.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Workspace'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}