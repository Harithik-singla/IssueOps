import { useState } from 'react';
import {
  Bell, MessageSquare, UserCheck, RefreshCw, Clock,
  Building2, Zap, Check, Trash2, CheckCheck,
} from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '../components/ui/index';
import { formatTimeAgo } from '../utils/formatDate';
import { mockNotifications } from '../data/mockData';
import { NOTIFICATION_TYPES } from '../utils/constants';
import AppLayout from '../components/layout/AppLayout';

const typeConfig = {
  MENTION:           { icon: MessageSquare, color: 'bg-blue-100 text-blue-600',   label: 'Mention' },
  ASSIGNMENT:        { icon: UserCheck,     color: 'bg-purple-100 text-purple-600', label: 'Assignment' },
  STATUS_CHANGE:     { icon: RefreshCw,     color: 'bg-amber-100 text-amber-600',  label: 'Status Change' },
  DUE_DATE_REMINDER: { icon: Clock,         color: 'bg-red-100 text-red-600',      label: 'Due Date' },
  WORKSPACE_INVITE:  { icon: Building2,     color: 'bg-green-100 text-green-600',  label: 'Invite' },
  AUTOMATION_ALERT:  { icon: Zap,           color: 'bg-orange-100 text-orange-600',label: 'Automation' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearRead = () => setNotifications(prev => prev.filter(n => !n.read));

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="secondary" size="sm" onClick={markAllRead}>
                <CheckCheck size={13} /> Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearRead}>
              <Trash2 size={13} /> Clear read
            </Button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {['all', 'unread'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* List */}
        <Card>
          {filtered.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              description="You're all caught up! We'll notify you when something needs your attention."
            />
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(n => {
                const cfg = typeConfig[n.type] || typeConfig.MENTION;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                      !n.read ? 'bg-blue-50/30' : ''
                    }`}
                    onClick={() => markRead(n.id)}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!n.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{formatTimeAgo(n.createdAt)}</span>
                        <Badge className={`${cfg.color} text-[10px]`}>{cfg.label}</Badge>
                      </div>
                    </div>

                    {/* Mark read */}
                    {!n.read && (
                      <button
                        onClick={e => { e.stopPropagation(); markRead(n.id); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex-shrink-0"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
