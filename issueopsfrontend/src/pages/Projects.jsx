import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Calendar, Target } from 'lucide-react';
import { Card, Button, Modal, Input, Textarea, Select, Badge, ProgressBar } from '../components/ui/index';
import { formatDate } from '../utils/formatDate';
import { mockProjects } from '../data/mockData';
import AppLayout from '../components/layout/AppLayout';

const statusOptions = [
  { value: 'PLANNING', label: 'Planning' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
];

const statusColors = {
  PLANNING: 'bg-purple-50 text-purple-600',
  ACTIVE: 'bg-green-50 text-green-600',
  ON_HOLD: 'bg-amber-50 text-amber-600',
  COMPLETED: 'bg-gray-100 text-gray-500',
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', deadline: '', status: 'ACTIVE' });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const p = { id: `p${Date.now()}`, workspaceId: 'ws1', ...form, totalIssues: 0, completedIssues: 0, color: '#6366f1' };
    setProjects([...projects, p]);
    setForm({ name: '', description: '', deadline: '', status: 'ACTIVE' });
    setCreateOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-400 mt-0.5">{projects.length} projects</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(p => {
            const pct = p.totalIssues > 0 ? Math.round((p.completedIssues / p.totalIssues) * 100) : 0;
            return (
              <Card key={p.id} className="p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                  </div>
                  <Badge className={statusColors[p.status] || statusColors.ACTIVE}>{p.status}</Badge>
                </div>
                {p.description && <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{p.description}</p>}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{p.completedIssues} of {p.totalIssues} issues done</span>
                    <span className="font-medium text-gray-600">{pct}%</span>
                  </div>
                  <ProgressBar value={p.completedIssues} max={p.totalIssues || 1} />
                </div>
                {p.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={11} />
                    <span>Due {formatDate(p.deadline)}</span>
                  </div>
                )}
                <Button className="w-full justify-center mt-4" variant="secondary" size="sm" onClick={e => { e.stopPropagation(); navigate(`/projects/${p.id}`); }}>
                  Open Project
                </Button>
              </Card>
            );
          })}
        </div>

        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Project">
          <div className="flex flex-col gap-4">
            <Input label="Project name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Backend API" />
            <Textarea label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What is this project about?" rows={3} />
            <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
            <Select label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} options={statusOptions} />
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.name.trim()}>Create Project</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
