import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, FolderOpen, Users, Calendar } from 'lucide-react';
import { Card, Button, Modal, Input, Textarea, Badge } from '../components/ui/index';
import { roleColors } from '../utils/statusColors';
import { formatDate } from '../utils/formatDate';
import { mockWorkspaces } from '../data/mockData';
import AppLayout from '../components/layout/AppLayout';

export default function Workspaces() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const ws = { id: `ws${Date.now()}`, name: form.name, description: form.description, memberCount: 1, projectCount: 0, role: 'OWNER', createdAt: new Date().toISOString() };
    setWorkspaces([...workspaces, ws]);
    setForm({ name: '', description: '' });
    setCreateOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-sm text-gray-400 mt-0.5">{workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New Workspace
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map(ws => (
            <Card key={ws.id} className="p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/workspaces/${ws.id}`)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {ws.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{ws.name}</h3>
                    <Badge className={`${roleColors[ws.role]?.bg} ${roleColors[ws.role]?.text} mt-0.5 text-[10px]`}>{ws.role}</Badge>
                  </div>
                </div>
              </div>
              {ws.description && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{ws.description}</p>}
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto">
                <span className="flex items-center gap-1"><FolderOpen size={12} />{ws.projectCount} projects</span>
                <span className="flex items-center gap-1"><Users size={12} />{ws.memberCount} members</span>
                <span className="flex items-center gap-1 ml-auto"><Calendar size={12} />{formatDate(ws.createdAt)}</span>
              </div>
              <Button className="w-full justify-center mt-4" variant="secondary" size="sm" onClick={e => { e.stopPropagation(); navigate(`/workspaces/${ws.id}`); }}>
                Open Workspace
              </Button>
            </Card>
          ))}
        </div>

        {/* Create modal */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Workspace">
          <div className="flex flex-col gap-4">
            <Input label="Workspace name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Water Quality Team" />
            <Textarea label="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What does this workspace cover?" rows={3} />
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.name.trim()}>Create Workspace</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
