import { Link } from 'react-router-dom';
import { CircleDot, Zap, Users, MessageSquare, Activity, BarChart2, Webhook, Bell, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Activity,      title: 'Realtime Updates',     desc: 'Live issue state synced across all team members via Socket.IO.' },
  { icon: Users,         title: 'Role-based Workspaces', desc: 'Owners, Admins, Members, and Viewers with granular permissions.' },
  { icon: MessageSquare, title: 'Comments & Mentions',   desc: 'Threaded discussions with @mention notifications.' },
  { icon: Clock,         title: 'Activity Logs',         desc: 'Full audit trail of every change, assignment, and comment.' },
  { icon: Zap,           title: 'Automation Rules',      desc: 'Trigger actions on status changes, due dates, and priority shifts.' },
  { icon: Webhook,       title: 'Webhook Integrations',  desc: 'POST events to Slack, GitHub Actions, or any HTTP endpoint.' },
  { icon: BarChart2,     title: 'Analytics Dashboard',   desc: 'Completion rates, workload charts, and overdue tracking.' },
  { icon: Bell,          title: 'Smart Reminders',       desc: 'Background jobs surface due-date reminders before it is too late.' },
];

const steps = [
  { n: '01', title: 'Create a workspace',  desc: 'Invite your team and assign roles in under a minute.' },
  { n: '02', title: 'Set up projects',     desc: 'Group issues by project with deadlines and status tracking.' },
  { n: '03', title: 'Track issues',        desc: 'Create, assign, prioritise, and move issues through your workflow.' },
  { n: '04', title: 'Automate the rest',   desc: 'Define rules that notify, assign, and trigger webhooks automatically.' },
];

const useCases = [
  { emoji: '🎓', title: 'College Projects',  desc: 'Coordinate final-year projects with role-based access for guides.' },
  { emoji: '⚡', title: 'Hackathons',        desc: 'Spin up a workspace in seconds; ship fast with Kanban boards.' },
  { emoji: '🚀', title: 'Startups',          desc: 'Professional issue tracking without the Jira overhead.' },
  { emoji: '👥', title: 'Small Teams',       desc: 'Remote or in-person—stay aligned with realtime updates.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-[Geist,system-ui,sans-serif]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <CircleDot size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">IssueOps</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Sign in</Link>
            <Link to="/register" className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors font-medium">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium mb-6 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Realtime · Open source · Self-hostable
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            Manage issues, automate<br />
            <span className="text-blue-500">workflows,</span> and collaborate<br />
            in realtime.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            IssueOps helps small teams track work, assign ownership, discuss issues, automate reminders, and maintain complete activity history.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm">
              View Demo
            </Link>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-5xl mx-auto mt-16 rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/80 overflow-hidden bg-gray-50">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 border-b border-gray-200">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="flex-1 mx-4 bg-white rounded text-xs text-gray-400 px-3 py-1">issueops.dev/dashboard</div>
          </div>
          <div className="bg-white p-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[{ l: 'Total Issues', v: '51', c: 'text-gray-900' }, { l: 'Open', v: '13', c: 'text-blue-600' }, { l: 'In Progress', v: '8', c: 'text-amber-600' }, { l: 'Completed', v: '22', c: 'text-green-600' }].map(m => (
              <div key={m.l} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{m.l}</p>
                <p className={`text-2xl font-bold ${m.c}`}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything your team needs</h2>
            <p className="text-gray-500">Built for small teams who want power without complexity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <f.icon size={18} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Up and running in under 5 minutes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.n} className="relative">
                <div className="text-4xl font-black text-gray-100 mb-2">{s.n}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for every team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map(u => (
              <div key={u.title} className="bg-white rounded-xl p-6 border border-gray-100 flex gap-4">
                <span className="text-3xl">{u.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{u.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to ship better, faster?</h2>
          <p className="text-gray-500 mb-8">Join teams already using IssueOps to stay on top of their work.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm">
              Create free workspace <ArrowRight size={14} />
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:border-gray-300 transition-colors text-sm">
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <CircleDot size={12} className="text-blue-400" />
            IssueOps — Realtime issue tracking for small teams
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/login" className="hover:text-gray-700">Login</Link>
            <Link to="/register" className="hover:text-gray-700">Register</Link>
            <Link to="/dashboard" className="hover:text-gray-700">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
