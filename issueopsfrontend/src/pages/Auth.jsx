import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleDot, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui/index';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'harithik@waterquality.dev', password: 'demo123', remember: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(form.email, form.password);
    if (res.success) navigate('/dashboard');
    else setError('Invalid credentials. Please try again.');
    setLoading(false);
  };

  return (
    <AuthShell>
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your IssueOps account</p>
        </div>
        <form onSubmit={handle} className="flex flex-col gap-4">
          {error && <div className="px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
          <Input label="Email address" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={form.remember} onChange={e => setForm({...form, remember: e.target.checked})} className="rounded" />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Forgot password?</a>
          </div>
          <Button type="submit" disabled={loading} className="w-full justify-center mt-1">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          No account? <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">Create one</Link>
        </p>
        <div className="mt-6 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 border border-gray-100">
          <strong className="text-gray-500">Demo:</strong> Use any email + password to explore
        </div>
      </div>
    </AuthShell>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    const res = await register(form);
    if (res.success) navigate('/dashboard');
    else setError('Something went wrong. Please try again.');
    setLoading(false);
  };

  return (
    <AuthShell>
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500">Start managing issues in minutes</p>
        </div>
        <form onSubmit={handle} className="flex flex-col gap-4">
          {error && <div className="px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}
          <Input label="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Harithik Reddy" required />
          <Input label="Email address" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 8 characters" required minLength={8} />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="Repeat password" required />
          <Button type="submit" disabled={loading} className="w-full justify-center mt-1">
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  );
}

function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
            <CircleDot size={14} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">IssueOps</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
