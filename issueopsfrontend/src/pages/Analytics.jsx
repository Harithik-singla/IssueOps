import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Clock, AlertTriangle, XCircle, Award, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/index';
import { mockAnalytics } from '../data/mockData';
import AppLayout from '../components/layout/AppLayout';

const STATUS_COLORS  = ['#94a3b8', '#60a5fa', '#fbbf24', '#a78bfa', '#f87171', '#34d399'];
const PRIORITY_COLORS = ['#94a3b8', '#fbbf24', '#f97316', '#ef4444'];

function MetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className={`p-5 flex items-start gap-4`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-600 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const { metrics, issuesByStatus, issuesByPriority, weeklyCompleted, memberWorkload, overdueByProject } = mockAnalytics;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Workspace performance overview</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <MetricCard icon={TrendingUp}   label="Completion Rate"         value={`${metrics.completionRate}%`}    color="bg-green-100 text-green-600" />
          <MetricCard icon={Clock}        label="Avg. Completion Time"    value={`${metrics.avgCompletionDays}d`} color="bg-blue-100 text-blue-600" sub="per issue" />
          <MetricCard icon={AlertTriangle}label="Blocked Issues"          value={metrics.blockedCount}            color="bg-red-100 text-red-600" />
          <MetricCard icon={XCircle}      label="Overdue Issues"          value={metrics.overdueCount}            color="bg-orange-100 text-orange-600" />
          <MetricCard icon={Award}        label="Most Active"             value={metrics.mostActiveMember.split(' ')[0]} color="bg-purple-100 text-purple-600" sub={metrics.mostActiveMember.split(' ').slice(1).join(' ')} />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issues by status */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Issues by Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={issuesByStatus}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                  labelLine={false}
                >
                  {issuesByStatus.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Issues by priority */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Issues by Priority</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={issuesByPriority} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {issuesByPriority.map((_, i) => (
                    <Cell key={i} fill={PRIORITY_COLORS[i % PRIORITY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly completed */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Issues Completed per Week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyCompleted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Overdue by project */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Overdue Issues by Project</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={overdueByProject} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <YAxis dataKey="project" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="overdue" fill="#f87171" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Member workload */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Member Workload</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockAnalytics.memberWorkload} barGap={4} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="assigned"  fill="#93c5fd" name="Assigned"  radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#34d399" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AppLayout>
  );
}
