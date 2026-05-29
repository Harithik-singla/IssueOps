import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, FolderOpen, UserPlus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { Card, Button, Modal, Input, Select, Badge, Tabs, Avatar, EmptyState } from '../components/ui/index';
import { roleColors } from '../utils/statusColors';
import { formatDate, formatRelative } from '../utils/formatDate';
import { mockWorkspaces, mockMembers, mockProjects, mockActivity } from '../data/mockData';
import AppLayout from '../components/layout/AppLayout';

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'VIEWER', label: 'Viewer' },
];

export default function WorkspaceDetail() {
  const { id } = useParams();
  const ws = mockWorkspaces.find(w => w.id === id) || mockWorkspaces[0];
  const [tab, setTab] = useState('overview');
  const [members, setMembers] = useState(mockMembers.filter(m => m.workspaceId === (id || 'ws1')));
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'MEMBER' });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members', count: members.length },
    { id: 'projects', label: 'Projects', count: mockProjects.length },
    { id: 'activity', label: 'Activity' },
  ];

  const handleInvite = () => {
    if (!inviteForm.email.trim()) return;
    setInviteOpen(false);
    setInviteForm({ email: '', role: 'MEMBER' });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
              {ws.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{ws.name}</h1>
              {ws.description && <p className="text-sm text-gray-400 mt-0.5">{ws.description}</p>}
            </div>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus size={14} /> Invite Member
          </Button>
        </div>

        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Members', value: members.length, icon: Users },
                  { label: 'Projects', value: mockProjects.length, icon: FolderOpen },
                  { label: 'Your Role', value: ws.role, icon: null },
                ].map(s => (
                  <Card key={s.label} className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </Card>
                ))}
              </div>
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Projects</h3>
                <div className="space-y-2">
                  {mockProjects.map(p => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                      <span className="text-sm font-medium text-gray-700 flex-1">{p.name}</span>
                      <span className="text-xs text-gray-400">{p.completedIssues}/{p.totalIssues} issues</span>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
            <Card className="p-5 h-fit">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {mockActivity.slice(0, 5).map(a => (
                  <div key={a.id} className="flex items-start gap-2">
                    <Avatar user={a.actor} size="xs" />
                    <div>
                      <p className="text-xs text-gray-600"><span className="font-medium">{a.actor.name.split(' ')[0]}</span> {a.action}</p>
                      <p className="text-[11px] text-gray-400">{formatRelative(a.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Members */}
        {tab === 'members' && (
          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Member</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar user={m.user} size="sm" />
                        <span className="text-sm font-medium text-gray-800">{m.user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{m.user.email}</td>
                    <td className="px-5 py-3">
                      <Badge className={`${roleColors[m.role]?.bg} ${roleColors[m.role]?.text}`}>{m.role}</Badge>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{formatDate(m.joinedAt)}</td>
                    <td className="px-5 py-3">
                      {m.role !== 'OWNER' && (
                        <button className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Projects */}
        {tab === 'projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map(p => (
              <Link key={p.id} to={`/projects/${p.id}`}>
                <Card className="p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                    <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>
                  <div className="text-xs text-gray-400">{p.completedIssues}/{p.totalIssues} issues completed</div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Activity */}
        {tab === 'activity' && (
          <Card className="p-5">
            <div className="space-y-4">
              {mockActivity.map(a => (
                <div key={a.id} className="flex items-start gap-3">
                  <Avatar user={a.actor} size="sm" />
                  <div>
                    <p className="text-sm text-gray-700"><span className="font-medium">{a.actor.name}</span> {a.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelative(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Invite modal */}
        <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Member">
          <div className="flex flex-col gap-4">
            <Input label="Email address" type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} placeholder="colleague@example.com" />
            <Select label="Role" value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} options={roleOptions} />
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button onClick={handleInvite}>Send Invite</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
