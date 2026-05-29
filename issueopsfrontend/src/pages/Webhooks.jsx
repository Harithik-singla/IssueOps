import { useState } from 'react';
import { Plus, Webhook, Trash2, Edit2, ToggleLeft, ToggleRight, ExternalLink, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, Button, Modal, Input, Badge, EmptyState, Tabs } from '../components/ui/index';
import { formatDate, formatTimeAgo } from '../utils/formatDate';
import { mockWebhooks, mockDeliveries } from '../data/mockData';
import { WEBHOOK_EVENTS } from '../utils/constants';
import AppLayout from '../components/layout/AppLayout';

const initialForm = { name: '', url: '', secret: '', events: [], enabled: true };

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [tab, setTab] = useState('webhooks');

  const toggleWebhook = (id) => setWebhooks(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  const deleteWebhook = (id) => setWebhooks(prev => prev.filter(w => w.id !== id));
  const toggleEvent = (ev) => setForm(f => ({
    ...f,
    events: f.events.includes(ev) ? f.events.filter(e => e !== ev) : [...f.events, ev],
  }));

  const handleCreate = () => {
    if (!form.name.trim() || !form.url.trim()) return;
    const w = { id: `wh${Date.now()}`, workspaceId: 'ws1', ...form, lastDelivery: null, lastStatus: null, createdAt: new Date().toISOString() };
    setWebhooks([...webhooks, w]);
    setForm(initialForm);
    setCreateOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Webhooks</h1>
            <p className="text-sm text-gray-400 mt-0.5">{webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configured</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New Webhook
          </Button>
        </div>

        <Tabs
          tabs={[
            { id: 'webhooks', label: 'Webhooks', count: webhooks.length },
            { id: 'deliveries', label: 'Delivery Logs', count: mockDeliveries.length },
          ]}
          active={tab}
          onChange={setTab}
        />

        {/* Webhooks list */}
        {tab === 'webhooks' && (
          <Card>
            {webhooks.length === 0 ? (
              <EmptyState
                icon={Webhook}
                title="No webhooks configured"
                description="Add a webhook to send HTTP POST events to external services like Slack or GitHub Actions."
                action={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={12} />Add Webhook</Button>}
              />
            ) : (
              <div className="divide-y divide-gray-50">
                {webhooks.map(w => (
                  <div key={w.id} className="p-5 group hover:bg-gray-50/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${w.enabled ? 'bg-blue-50' : 'bg-gray-100'}`}>
                          <Webhook size={15} className={w.enabled ? 'text-blue-500' : 'text-gray-400'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${w.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{w.name}</span>
                            {w.lastStatus && (
                              <Badge className={w.lastStatus === 200 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}>
                                {w.lastStatus}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                            <ExternalLink size={10} />
                            <span className="font-mono truncate max-w-sm">{w.url}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {w.events.map(ev => (
                              <Badge key={ev} className="bg-gray-100 text-gray-500 font-mono text-[10px]">{ev}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => toggleWebhook(w.id)} title={w.enabled ? 'Disable' : 'Enable'}>
                          {w.enabled
                            ? <ToggleRight size={20} className="text-blue-500" />
                            : <ToggleLeft size={20} className="text-gray-300" />
                          }
                        </button>
                        <button onClick={() => deleteWebhook(w.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {w.lastDelivery && (
                      <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                        Last delivery: {formatTimeAgo(w.lastDelivery)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Delivery logs */}
        {tab === 'deliveries' && (
          <Card>
            {mockDeliveries.length === 0 ? (
              <EmptyState icon={RefreshCw} title="No deliveries yet" description="Webhook deliveries will appear here once events are triggered." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Event', 'Status', 'Response', 'Attempts', 'Last Attempted'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockDeliveries.map(d => (
                      <tr key={d.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <Badge className="bg-gray-100 text-gray-600 font-mono text-[10px]">{d.event}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            {d.status === 'success'
                              ? <CheckCircle size={14} className="text-green-500" />
                              : <XCircle size={14} className="text-red-400" />
                            }
                            <span className={`text-xs font-medium ${d.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                              {d.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge className={d.responseCode < 300 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}>
                            {d.responseCode}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">{d.attempts}</td>
                        <td className="px-5 py-3 text-xs text-gray-400">{formatTimeAgo(d.lastAttemptAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Create modal */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Webhook" width="max-w-xl">
          <div className="flex flex-col gap-4">
            <Input label="Webhook name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Slack integration" />
            <Input label="Webhook URL" type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://hooks.slack.com/services/..." />
            <Input label="Secret (optional)" value={form.secret} onChange={e => setForm({...form, secret: e.target.value})} placeholder="Signing secret for verification" />
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Events to subscribe</label>
              <div className="grid grid-cols-2 gap-2">
                {WEBHOOK_EVENTS.map(ev => (
                  <label key={ev} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 border border-gray-100">
                    <input
                      type="checkbox"
                      checked={form.events.includes(ev)}
                      onChange={() => toggleEvent(ev)}
                      className="rounded"
                    />
                    <span className="text-xs font-mono text-gray-600">{ev}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} className="rounded" />
              Enable webhook immediately
            </label>
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.name.trim() || !form.url.trim()}>Create Webhook</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
