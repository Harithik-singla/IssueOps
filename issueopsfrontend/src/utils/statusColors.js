export const statusColors = {
  BACKLOG:     { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400',   border: 'border-gray-200' },
  TODO:        { bg: 'bg-blue-50',    text: 'text-blue-600',   dot: 'bg-blue-400',   border: 'border-blue-100' },
  IN_PROGRESS: { bg: 'bg-amber-50',   text: 'text-amber-600',  dot: 'bg-amber-400',  border: 'border-amber-100' },
  IN_REVIEW:   { bg: 'bg-purple-50',  text: 'text-purple-600', dot: 'bg-purple-400', border: 'border-purple-100' },
  BLOCKED:     { bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-400',    border: 'border-red-100' },
  DONE:        { bg: 'bg-green-50',   text: 'text-green-600',  dot: 'bg-green-400',  border: 'border-green-100' },
  CANCELLED:   { bg: 'bg-gray-100',   text: 'text-gray-400',   dot: 'bg-gray-300',   border: 'border-gray-200' },
};

export const priorityColors = {
  LOW:    { bg: 'bg-slate-100',   text: 'text-slate-500',  icon: 'text-slate-400' },
  MEDIUM: { bg: 'bg-yellow-50',   text: 'text-yellow-600', icon: 'text-yellow-500' },
  HIGH:   { bg: 'bg-orange-50',   text: 'text-orange-600', icon: 'text-orange-500' },
  URGENT: { bg: 'bg-red-50',      text: 'text-red-600',    icon: 'text-red-500' },
};

export const typeColors = {
  TASK:          { bg: 'bg-blue-50',   text: 'text-blue-600' },
  BUG:           { bg: 'bg-red-50',    text: 'text-red-600' },
  FEATURE:       { bg: 'bg-purple-50', text: 'text-purple-600' },
  DOCUMENTATION: { bg: 'bg-teal-50',   text: 'text-teal-600' },
  RESEARCH:      { bg: 'bg-cyan-50',   text: 'text-cyan-600' },
  IMPROVEMENT:   { bg: 'bg-green-50',  text: 'text-green-600' },
};

export const roleColors = {
  OWNER:  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  ADMIN:  { bg: 'bg-blue-100',   text: 'text-blue-700' },
  MEMBER: { bg: 'bg-gray-100',   text: 'text-gray-600' },
  VIEWER: { bg: 'bg-gray-50',    text: 'text-gray-400' },
};
