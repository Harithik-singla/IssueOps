import { useState } from 'react';
import { User, Building2, FolderOpen, Bell, Key, AlertTriangle, Copy, RefreshCw, Eye, EyeOff, Check, Shield } from 'lucide-react';
import { Card, Button, Input, Textarea, Select, Tabs, Avatar, Badge } from '../components/ui/index';
import { currentUser, mockWorkspaces } from '../data/mockData';
import AppLayout from '../components/layout/AppLayout';

const sections = [
  { id: 'profile',       label: 'Profile',               icon: User },
  { id: 'workspace',     label: 'Workspace',             icon: Building2 },
  { id: 'notifications', label: 'Notifications',         icon: Bell },
  { id: 'api',           label: 'API Settings',          icon: Key },
  { id: 'danger',        label: 'Danger Zone',           icon: AlertTriangle },
];

function SectionNav({ active, onChange }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {sections.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
            active === s.id
              ? 'bg-blue-50 text-blue-600 font-medium'
              : s.id === 'danger'
                ? 'text-red-400 hover:bg-red-50'
                : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <s.icon size={15} className={s.id === 'danger' ? 'text-red-400' : ''} />
          {s.label}
        </button>
      ))}
    </nav>
  );
}

export default function Settings() {
  const [section, setSection] = useState('profile');
  const [profile, setProfile] = useState({ name: currentUser.name, email: currentUser.email, bio: '' });
  const [saved, setSaved] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifs, setNotifs] = useState({
    mention: true, assignment: true, statusChange: true, dueDate: true, invite: true, automation: false,
  });
  const ws = mockWorkspaces[0];

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const generateApiKey = () => {
    const key = 'iosk_' + Array.from({ length: 40 }, () => Math.random().toString(36)[2]).join('');
    setApiKey(key);
    setShowApiKey(true);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your account and workspace configuration</p>
        </div>

        <div className="flex gap-6">
          {/* Side nav */}
          <div className="w-44 flex-shrink-0">
            <SectionNav active={section} onChange={setSection} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Profile */}
            {section === 'profile' && (
              <Card className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-5">Profile Settings</h2>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <Avatar user={currentUser} size="lg" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.email}</p>
                    <Button variant="secondary" size="sm" className="mt-2">Change Avatar</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Input label="Full name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                  <Input label="Email address" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={e => setProfile({...profile, bio: e.target.value})}
                      placeholder="A short bio about yourself…"
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveProfile}>
                      {saved ? <><Check size={13} /> Saved</> : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Workspace settings */}
            {section === 'workspace' && (
              <Card className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-5">Workspace Settings</h2>
                <div className="flex flex-col gap-4">
                  <Input label="Workspace name" defaultValue={ws.name} />
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
                    <textarea defaultValue={ws.description} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  </div>
                  <Select
                    label="Default issue priority"
                    options={[{ value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'LOW', label: 'Low' }]}
                  />
                  <div className="flex justify-end">
                    <Button>Save Workspace</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Notification preferences */}
            {section === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-5">Notification Preferences</h2>
                <div className="divide-y divide-gray-50">
                  {[
                    { key: 'mention',      label: 'Mentions',              desc: 'When someone @mentions you in a comment' },
                    { key: 'assignment',   label: 'Issue assignments',      desc: 'When an issue is assigned to you' },
                    { key: 'statusChange', label: 'Status changes',         desc: 'When a status changes on your issues' },
                    { key: 'dueDate',      label: 'Due date reminders',     desc: '24 hours before an issue is due' },
                    { key: 'invite',       label: 'Workspace invites',      desc: 'When someone joins your workspace' },
                    { key: 'automation',   label: 'Automation alerts',      desc: 'When an automation rule fires' },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{n.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notifs[n.key]}
                          onChange={e => setNotifs({...notifs, [n.key]: e.target.checked})}
                        />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button>Save Preferences</Button>
                </div>
              </Card>
            )}

            {/* API settings */}
            {section === 'api' && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Shield size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">API Settings</h2>
                    <p className="text-xs text-gray-400">Use API keys to access IssueOps programmatically</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5">
                  {apiKey ? (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Your API Key — copy it now, it won't be shown again</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                          <Key size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-xs font-mono text-gray-700 flex-1 truncate">
                            {showApiKey ? apiKey : '•'.repeat(40)}
                          </span>
                          <button onClick={() => setShowApiKey(!showApiKey)} className="text-gray-400 hover:text-gray-600">
                            {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                        <Button size="sm" variant="secondary" onClick={copyApiKey}>
                          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No API key generated yet. Generate one below.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateApiKey}>
                    <RefreshCw size={13} /> {apiKey ? 'Regenerate Key' : 'Generate API Key'}
                  </Button>
                  {apiKey && (
                    <Button variant="danger" onClick={() => { setApiKey(''); setShowApiKey(false); }}>
                      Revoke Key
                    </Button>
                  )}
                </div>

                <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-2">Usage example</p>
                  <pre className="text-xs font-mono text-gray-500 whitespace-pre-wrap leading-relaxed">
{`curl -H "Authorization: Bearer YOUR_KEY" \\
  ${import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api'}/issues`}
                  </pre>
                </div>
              </Card>
            )}

            {/* Danger zone */}
            {section === 'danger' && (
              <Card className="p-6 border-red-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-red-500" />
                  </div>
                  <h2 className="text-base font-semibold text-red-700">Danger Zone</h2>
                </div>

                <div className="divide-y divide-red-50">
                  {[
                    { label: 'Delete all issues', desc: 'Permanently delete all issues in this workspace. This cannot be undone.', btn: 'Delete Issues' },
                    { label: 'Reset workspace',   desc: 'Remove all projects, issues, and member data. The workspace shell remains.', btn: 'Reset Workspace' },
                    { label: 'Delete account',    desc: 'Permanently delete your account and all data associated with it.', btn: 'Delete Account' },
                  ].map(d => (
                    <div key={d.label} className="flex items-start justify-between py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{d.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-sm">{d.desc}</p>
                      </div>
                      <Button variant="danger" size="sm">{d.btn}</Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
