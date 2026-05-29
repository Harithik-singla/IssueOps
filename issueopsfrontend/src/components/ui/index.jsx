import { X } from 'lucide-react';

// ── Badge ──────────────────────────────────────────────
export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

// ── Button ─────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button', ...props }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' };
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200',
    ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ── Card ───────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  return (
    <div onClick={onClick} className={`bg-white border border-gray-100 rounded-xl shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-200 transition-all' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <input
        className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${error ? 'border-red-300' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

// ── Textarea ───────────────────────────────────────────
export function Textarea({ label, error, className = '', rows = 4, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <textarea
        rows={rows}
        className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none ${error ? 'border-red-300' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────
export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <select
        className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${error ? 'border-red-300' : ''} ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${width} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────
const avatarColors = ['bg-blue-100 text-blue-600','bg-purple-100 text-purple-600','bg-green-100 text-green-600','bg-amber-100 text-amber-600','bg-red-100 text-red-600','bg-teal-100 text-teal-600'];
export function Avatar({ user, size = 'md' }) {
  const sizes = { xs: 'w-5 h-5 text-[10px]', sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' };
  const color = user ? avatarColors[(user.name?.charCodeAt(0) || 0) % avatarColors.length] : 'bg-gray-100 text-gray-500';
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${color}`}>
      {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : (user?.initials || '?')}
    </div>
  );
}

// ── ProgressBar ────────────────────────────────────────
export function ProgressBar({ value, max = 100, className = '' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className={`w-full bg-gray-100 rounded-full h-1.5 overflow-hidden ${className}`}>
      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Tabs ───────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
            active === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4"><Icon size={24} className="text-gray-400" /></div>}
      <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-xs text-gray-400 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <div className={`${s[size]} border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin`} />;
}

// ── LoadingPage ────────────────────────────────────────
export function LoadingPage({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
