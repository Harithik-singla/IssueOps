import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FolderOpen, CircleDot, Kanban, Bell, BarChart2,
  Zap, Webhook, Settings, ChevronDown, Plus, Search, LogOut, User, X, Menu,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Avatar } from '../ui/index';
import { mockWorkspaces, mockNotifications } from '../../data/mockData';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workspaces',  icon: Building2,        label: 'Workspaces' },
  { to: '/projects',    icon: FolderOpen,       label: 'Projects' },
  { to: '/issues',      icon: CircleDot,        label: 'Issues' },
  { to: '/kanban',      icon: Kanban,           label: 'Kanban' },
  { to: '/notifications', icon: Bell,           label: 'Notifications' },
  { to: '/analytics',   icon: BarChart2,        label: 'Analytics' },
  { to: '/automation',  icon: Zap,              label: 'Automation' },
  { to: '/webhooks',    icon: Webhook,          label: 'Webhooks' },
  { to: '/settings',    icon: Settings,         label: 'Settings' },
];

function SidebarItem({ item }) {
  const loc = useLocation();
  const active = loc.pathname === item.to || loc.pathname.startsWith(item.to + '/');
  return (
    <Link to={item.to} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
      <item.icon size={16} className={active ? 'text-blue-500' : ''} />
      {item.label}
    </Link>
  );
}

export function Sidebar({ collapsed, onClose }) {
  const { currentWorkspace } = useWorkspace();
  const [wsOpen, setWsOpen] = useState(false);

  return (
    <>
      {/* mobile overlay */}
      {!collapsed && <div className="lg:hidden fixed inset-0 z-30 bg-black/20" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full z-40 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200
        ${collapsed ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0`}
        style={{ width: 240 }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <CircleDot size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">IssueOps</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 rounded text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>

        {/* Workspace switcher */}
        <div className="px-3 py-3 border-b border-gray-50">
          <button onClick={() => setWsOpen(!wsOpen)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {currentWorkspace?.name?.[0] || 'W'}
            </div>
            <span className="text-xs font-medium text-gray-700 flex-1 truncate">{currentWorkspace?.name}</span>
            <ChevronDown size={12} className={`text-gray-400 transition-transform ${wsOpen ? 'rotate-180' : ''}`} />
          </button>
          {wsOpen && (
            <div className="mt-1 rounded-lg border border-gray-100 shadow-lg bg-white overflow-hidden">
              {mockWorkspaces.map(ws => (
                <button key={ws.id} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-bold">{ws.name[0]}</div>
                  <span className="truncate">{ws.name}</span>
                  {ws.id === currentWorkspace?.id && <ChevronRight size={10} className="ml-auto text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => <SidebarItem key={item.to} item={item} />)}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          IssueOps v1.0
        </div>
      </aside>
    </>
  );
}

export function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 right-0 z-20 bg-white border-b border-gray-100 flex items-center px-4 gap-3"
      style={{ left: 240, height: 56 }}>
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-pointer hover:border-gray-300 transition-colors">
          <Search size={14} />
          <span>Search issues, projects…</span>
          <span className="ml-auto text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5">⌘K</span>
        </div>
      </div>

      {/* Create issue */}
      <button onClick={() => navigate('/issues')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
        <Plus size={14} />
        <span className="hidden sm:block">New Issue</span>
      </button>

      {/* Notifications */}
      <Link to="/notifications" className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Link>

      {/* Profile */}
      <div className="relative">
        <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar user={user} size="sm" />
          <ChevronDown size={12} className="text-gray-400" />
        </button>
        {profileOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-xl z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                <User size={14} /> Profile Settings
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={!sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="pt-14 min-h-screen" style={{ paddingLeft: 240 }}>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
