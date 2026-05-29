import { useState } from 'react';
import { Plus, Zap, Trash2, Edit2, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import { Card, Button, Modal, Input, Select, Badge, EmptyState } from '../components/ui/index';
import { formatDate } from '../utils/formatDate';
import { mockAutomationRules } from '../data/mockData';
import { AUTOMATION_TRIGGERS, AUTOMATION_ACTIONS } from '../utils/constants';
import AppLayout from '../components/layout/AppLayout';

const triggerOpts  = AUTOMATION_TRIGGERS.map(t => ({ value: t, label: t.replace(/_/g, ' ') }));
const actionOpts   = AUTOMATION_ACTIONS.map(a  => ({ value: a, label: a.replace(/_/g, ' ') }));
const operatorOpts = [
  { value: 'equals',           label: 'equals' },
  { value: 'not_equals',       label: 'does not equal' },
  { value: 'contains',         label: 'contains' },
  { value: 'greater_than',     label: 'greater than' },
];

const initialForm = {
  name: '', trigger: 'ISSUE_STATUS_CHANGED', conditionField: 'status',
  conditionOperator: 'equals', conditionValue: '', actionType: 'SEND_NOTIFICATION', actionTarget: '', enabled: true,
};

const triggerColor = {
  ISSUE_CREATED:        'bg-blue-50 text-blue-600',
  ISSUE_STATUS_CHANGED: 'bg-amber-50 text-amber-600',
  ISSUE_ASSIGNED:       'bg-purple-50 text-purple-600',
  COMMENT_CREATED:      'bg-teal-50 text-teal-600',
  DUE_DATE_NEAR:        'bg-red-50 text-red-600',
  PRIORITY_CHANGED:     'bg-orange-50 text-orange-600',
};

const actionColor = {
  SEND_NOTIFICATION: 'bg-blue-50 text-blue-600',
  SEND_EMAIL:        'bg-green-50 text-green-600',
  TRIGGER_WEBHOOK:   'bg-gray-100 text-gray-600',
  ASSIGN_USER:       'bg-purple-50 text-purple-600',
  ADD_LABEL:         'bg-teal-50 text-teal-600',
};

export default function AutomationRules() {
  const [rules, setRules] = useState(mockAutomationRules);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const toggleRule = (id) => setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const deleteRule = (id) => setRules(prev => prev.filter(r => r.id !== id));

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const r = { id: `ar${Date.now()}`, workspaceId: 'ws1', ...form, createdAt: new Date().toISOString() };
    setRules([...rules, r]);
    setForm(initialForm);
    setCreateOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Automation Rules</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {rules.length} rule{rules.length !== 1 ? 's' : ''} · {rules.filter(r => r.enabled).length} active
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New Rule
          </Button>
        </div>

        {/* Rules table */}
        <Card>
          {rules.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No automation rules"
              description="Create rules to automatically notify, assign, or trigger actions based on issue events."
              action={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={12} />Create Rule</Button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Rule', 'Trigger', 'Condition', 'Action', 'Status', 'Created', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rules.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${r.enabled ? 'bg-blue-50' : 'bg-gray-100'}`}>
                            <Zap size={13} className={r.enabled ? 'text-blue-500' : 'text-gray-400'} />
                          </div>
                          <span className={`text-sm font-medium ${r.enabled ? 'text-gray-800' : 'text-gray-400'}`}>{r.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={triggerColor[r.trigger] || 'bg-gray-100 text-gray-500'}>
                          {r.trigger.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                          {r.conditionField} {r.conditionOperator} "{r.conditionValue}"
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={actionColor[r.actionType] || 'bg-gray-100 text-gray-500'}>
                          {r.actionType.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleRule(r.id)} className="flex items-center gap-1.5 text-xs transition-colors">
                          {r.enabled
                            ? <><ToggleRight size={18} className="text-blue-500" /><span className="text-green-600 font-medium">Active</span></>
                            : <><ToggleLeft size={18} className="text-gray-300" /><span className="text-gray-400">Inactive</span></>
                          }
                        </button>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400">{formatDate(r.createdAt)}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => deleteRule(r.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Example rules info */}
        <Card className="p-5 bg-blue-50/50 border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Zap size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-2">Example automation rules</p>
              <ul className="text-xs text-blue-600 space-y-1">
                {[
                  'When issue status becomes BLOCKED → notify workspace admins',
                  'When priority becomes URGENT → send email to project lead',
                  'When due date is tomorrow → send reminder to assignee',
                  'When issue is moved to DONE → trigger webhook',
                ].map((ex, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <ChevronRight size={10} /> {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Create modal */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Automation Rule" width="max-w-xl">
          <div className="flex flex-col gap-4">
            <Input label="Rule name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Alert on BLOCKED" />
            <Select label="Trigger" value={form.trigger} onChange={e => setForm({...form, trigger: e.target.value})} options={triggerOpts} />
            <div className="grid grid-cols-3 gap-2">
              <Input label="Condition field" value={form.conditionField} onChange={e => setForm({...form, conditionField: e.target.value})} placeholder="status" />
              <Select label="Operator" value={form.conditionOperator} onChange={e => setForm({...form, conditionOperator: e.target.value})} options={operatorOpts} />
              <Input label="Value" value={form.conditionValue} onChange={e => setForm({...form, conditionValue: e.target.value})} placeholder="BLOCKED" />
            </div>
            <Select label="Action type" value={form.actionType} onChange={e => setForm({...form, actionType: e.target.value})} options={actionOpts} />
            <Input label="Action target" value={form.actionTarget} onChange={e => setForm({...form, actionTarget: e.target.value})} placeholder="e.g. workspace_admins, assignee" />
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} className="rounded" />
              Enable rule immediately
            </label>
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.name.trim()}>Create Rule</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
