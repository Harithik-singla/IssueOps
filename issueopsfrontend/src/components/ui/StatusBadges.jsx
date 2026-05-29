import { statusColors, priorityColors, typeColors } from '../../utils/statusColors';
import { Badge } from './index';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpCircle, CheckCircle, Circle, Clock, MinusCircle, XCircle, Bug, BookOpen, FlaskConical, Lightbulb, Sparkles, CheckSquare } from 'lucide-react';

export function StatusBadge({ status }) {
  const colors = statusColors[status] || statusColors.BACKLOG;
  const labels = { BACKLOG: 'Backlog', TODO: 'Todo', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', BLOCKED: 'Blocked', DONE: 'Done', CANCELLED: 'Cancelled' };
  const icons = {
    BACKLOG: <Circle size={10} />,
    TODO: <Circle size={10} className="fill-current" />,
    IN_PROGRESS: <Clock size={10} />,
    IN_REVIEW: <ArrowUpCircle size={10} />,
    BLOCKED: <AlertCircle size={10} />,
    DONE: <CheckCircle size={10} />,
    CANCELLED: <XCircle size={10} />,
  };
  return (
    <Badge className={`${colors.bg} ${colors.text}`}>
      {icons[status]}
      {labels[status] || status}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  const colors = priorityColors[priority] || priorityColors.LOW;
  const labels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent' };
  const icons = {
    LOW: <ArrowDown size={10} />,
    MEDIUM: <MinusCircle size={10} />,
    HIGH: <ArrowUp size={10} />,
    URGENT: <AlertCircle size={10} />,
  };
  return (
    <Badge className={`${colors.bg} ${colors.text}`}>
      {icons[priority]}
      {labels[priority] || priority}
    </Badge>
  );
}

export function TypeBadge({ type }) {
  const colors = typeColors[type] || typeColors.TASK;
  const labels = { TASK: 'Task', BUG: 'Bug', FEATURE: 'Feature', DOCUMENTATION: 'Docs', RESEARCH: 'Research', IMPROVEMENT: 'Improvement' };
  const icons = {
    TASK: <CheckSquare size={10} />,
    BUG: <Bug size={10} />,
    FEATURE: <Sparkles size={10} />,
    DOCUMENTATION: <BookOpen size={10} />,
    RESEARCH: <FlaskConical size={10} />,
    IMPROVEMENT: <Lightbulb size={10} />,
  };
  return (
    <Badge className={`${colors.bg} ${colors.text}`}>
      {icons[type]}
      {labels[type] || type}
    </Badge>
  );
}

export function LabelBadge({ label }) {
  return <Badge className="bg-gray-100 text-gray-600 font-mono">{label}</Badge>;
}
