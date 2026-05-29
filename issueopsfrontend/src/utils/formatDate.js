import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy · h:mm a');
};

export const formatRelative = (date) => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return formatDistanceToNow(d, { addSuffix: true });
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const isOverdue = (date) => {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d < new Date();
};
