import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Tabs, Badge, ProgressBar, Avatar } from '../components/ui/index';
import { StatusBadge, PriorityBadge } from '../components/ui/StatusBadges';
import { formatDate, formatRelative } from '../utils/formatDate';
import { mockProjects, mockIssues, mockActivity, mockMembers } from '../data/mockData';
import AppLayout from '../components/layout/AppLayout';

const PIE_COLORS = ['#94a3b8', '#60a5fa', '#fbbf24', '#a78bfa', '#f87171', '#34d399', '#9ca3af'];

export default function ProjectDetail() {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id) || mockProjects[0];
  const issues = mockIssues.filter(i => i.projectId === (id || 'p1'));
  const [tab, setTab] = useState('overview');

  const statusDist = [
    { name: 'Backlog', value: issues.filter(i => i.status === 'BACKLOG').length },
    { name: 'Todo', value: issues.filter(i => i.status === 'TODO').length },
    { name: 'In Progress', value: issues.filter(i => i.status === 'IN_PROGRESS').length },
    { name: 'In Review', value: issues.filter(i => i.status === 'IN_REVIEW').length },
    { name: 'Blocked', value: issues.filter(i => i.status === 'BLOCKED').length },
    { name: 'Done', value: issues.filter(i => i.status === 'DONE').length },
  ].filter(s => s.value > 0);

  const pct = project.totalIssues > 0 ? Math.round((project.completedIssues / project.totalIssues) * 100) : 0;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'issues', label: 'Issues', count: issues.length },
    { id: 'board', label: 'Board' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/projects" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-4 h-4 rounded-full" style={{ background: project.color }} />
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            {project.status && <Badge className="bg-green-50 text-green-600">{project.status}</Badge>}
          </div>
        </div>

        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { l: 'Total Issues', v: project.totalIssues },
                { l: 'Completed', v: project.completedIssues },
                { l: 'Progress', v: `${pct}%` },
                { l: 'Deadline', v: formatDate(project.deadline) },
              ].map(s => (
                <Card key={s.l} className="p-4">
                  <p className="text-2xl font-bold text-gray-900">{s.v}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.l}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Issue Status Distribution</h3>
                {statusDist.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusDist} dataKey="value" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                        {statusDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="text-xs text-gray-400 py-8 text-center">No issues yet</p>}
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Issues</h3>
                {issues.length === 0
                  ? <p className="text-xs text-gray-400 py-4 text-center">No issues in this project.</p>
                  : <div className="space-y-2">
                      {issues.slice(0, 5).map(i => (
                        <Link key={i.id} to={`/issues/${i.id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <StatusBadge status={i.status} />
                          <span className="text-sm text-gray-700 flex-1 truncate">{i.title}</span>
                          <span className="text-xs text-gray-300 font-mono">{i.id}</span>
                        </Link>
                      ))}
                    </div>
                }
              </Card>
            </div>
          </div>
        )}

        {/* Issues tab */}
        {tab === 'issues' && (
          <Card>
            {issues.length === 0
              ? <div className="py-16 text-center text-sm text-gray-400">No issues found in this project.</div>
              : <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Issue</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Priority</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Assignee</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {issues.map(i => (
                      <tr key={i.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <Link to={`/issues/${i.id}`} className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-gray-800 hover:text-blue-600">{i.title}</span>
                            <span className="text-xs text-gray-300 font-mono">{i.id}</span>
                          </Link>
                        </td>
                        <td className="px-5 py-3"><StatusBadge status={i.status} /></td>
                        <td className="px-5 py-3"><PriorityBadge priority={i.priority} /></td>
                        <td className="px-5 py-3">
                          {i.assignee ? <div className="flex items-center gap-1.5"><Avatar user={i.assignee} size="xs" /><span className="text-xs text-gray-600">{i.assignee.name.split(' ')[0]}</span></div> : <span className="text-xs text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">{formatDate(i.dueDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </Card>
        )}

        {/* Board */}
        {tab === 'board' && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Switch to the <Link to="/kanban" className="text-blue-500 hover:text-blue-600">Kanban Board</Link> for drag-and-drop view.</p>
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <Card className="p-6 max-w-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Project Settings</h3>
            <p className="text-sm text-gray-400">Configure project name, description, deadline, and danger zone here. Connect your backend to enable live changes.</p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
