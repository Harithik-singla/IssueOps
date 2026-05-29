import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, TrendingUp, AlertTriangle, Target, ArrowRight, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, Avatar, ProgressBar } from '../components/ui/index';
import { StatusBadge, PriorityBadge } from '../components/ui/StatusBadges';
import { mockIssues, mockActivity, mockProjects, mockAnalytics, currentUser, mockUsers } from '../data/mockData';
import { formatRelative } from '../utils/formatDate';
import AppLayout from '../components/layout/AppLayout';

const summaryCards = [
  { label: 'Total Issues',  value: 51, icon: Target,       color: 'bg-gray-50 text-gray-600',   iconBg: 'bg-gray-100' },
  { label: 'Open',          value: 13, icon: AlertCircle,  color: 'bg-blue-50 text-blue-600',    iconBg: 'bg-blue-100' },
  { label: 'In Progress',   value: 8,  icon: Clock,        color: 'bg-amber-50 text-amber-600',  iconBg: 'bg-amber-100' },
  { label: 'Blocked',       value: 1,  icon: AlertTriangle,color: 'bg-red-50 text-red-600',      iconBg: 'bg-red-100' },
  { label: 'Completed',     value: 22, icon: CheckCircle,  color: 'bg-green-50 text-green-600',  iconBg: 'bg-green-100' },
  { label: 'Overdue',       value: 3,  icon: TrendingUp,   color: 'bg-orange-50 text-orange-600',iconBg: 'bg-orange-100' },
];

const myIssues = mockIssues.filter(i => i.assignee?.id === currentUser.id).slice(0, 5);

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Good morning, {currentUser.name.split(' ')[0]} 👋</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {summaryCards.map(c => (
            <Card key={c.label} className={`p-4 ${c.color}`}>
              <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center mb-3`}>
                <c.icon size={16} />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs opacity-70 mt-0.5">{c.label}</p>
            </Card>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Issues Completed / Week</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockAnalytics.weeklyCompleted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
                <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Project progress */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Project Progress</h2>
              <Link to="/projects" className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-0.5">All <ChevronRight size={12} /></Link>
            </div>
            <div className="space-y-4">
              {mockProjects.map(p => (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-700 truncate flex-1">{p.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{p.completedIssues}/{p.totalIssues}</span>
                  </div>
                  <ProgressBar value={p.completedIssues} max={p.totalIssues} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My issues */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">My Issues</h2>
              <Link to="/issues" className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-0.5">All <ChevronRight size={12} /></Link>
            </div>
            {myIssues.length === 0
              ? <p className="text-xs text-gray-400 py-4 text-center">No issues assigned to you.</p>
              : <div className="divide-y divide-gray-50">
                  {myIssues.map(i => (
                    <Link key={i.id} to={`/issues/${i.id}`} className="flex items-center gap-3 py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                      <StatusBadge status={i.status} />
                      <span className="text-sm text-gray-700 flex-1 truncate">{i.title}</span>
                      <PriorityBadge priority={i.priority} />
                    </Link>
                  ))}
                </div>
            }
          </Card>

          {/* Activity feed */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {mockActivity.map(a => (
                <div key={a.id} className="flex items-start gap-3">
                  <Avatar user={a.actor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700">
                      <span className="font-medium">{a.actor.name.split(' ')[0]}</span>{' '}
                      {a.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelative(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
