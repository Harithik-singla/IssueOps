import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCorners,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { MessageSquare, Calendar, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar, Badge } from '../components/ui/index';
import { PriorityBadge, LabelBadge } from '../components/ui/StatusBadges';
import { formatDate } from '../utils/formatDate';
import { mockIssues } from '../data/mockData';
import { issueApi } from '../api/issueApi';
import AppLayout from '../components/layout/AppLayout';

const COLUMNS = [
  { id: 'BACKLOG',     label: 'Backlog',     color: '#94a3b8' },
  { id: 'TODO',        label: 'Todo',        color: '#60a5fa' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#fbbf24' },
  { id: 'IN_REVIEW',   label: 'In Review',   color: '#a78bfa' },
  { id: 'BLOCKED',     label: 'Blocked',     color: '#f87171' },
  { id: 'DONE',        label: 'Done',        color: '#34d399' },
];

function IssueCard({ issue, isDragging = false }) {
  return (
    <div className={`bg-white border rounded-xl p-3.5 select-none transition-all ${
      isDragging ? 'shadow-2xl rotate-1 scale-105 border-blue-200' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-grab active:cursor-grabbing'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          to={`/issues/${issue.id}`}
          className="text-sm font-medium text-gray-800 hover:text-blue-600 leading-snug line-clamp-2 flex-1"
          onClick={e => isDragging && e.preventDefault()}
        >
          {issue.title}
        </Link>
        <button className="p-0.5 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
          <MoreHorizontal size={13} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        <PriorityBadge priority={issue.priority} />
        {issue.labels.slice(0, 2).map(l => <LabelBadge key={l} label={l} />)}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {issue.commentCount > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare size={10} /> {issue.commentCount}
            </span>
          )}
          {issue.dueDate && (
            <span className="flex items-center gap-0.5">
              <Calendar size={10} /> {formatDate(issue.dueDate)}
            </span>
          )}
        </div>
        {issue.assignee && <Avatar user={issue.assignee} size="xs" />}
      </div>
    </div>
  );
}

function DraggableCard({ issue }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: issue.id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{ opacity: isDragging ? 0.3 : 1 }}>
      <IssueCard issue={issue} />
    </div>
  );
}

function Column({ column, issues }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className="flex flex-col min-w-[260px] w-[260px]">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: column.color }} />
        <span className="text-sm font-semibold text-gray-700">{column.label}</span>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {issues.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl min-h-[200px] p-2 space-y-2 transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-dashed border-blue-200' : 'bg-gray-50/60 border-2 border-dashed border-transparent'
        }`}
      >
        {issues.map(issue => (
          <DraggableCard key={issue.id} issue={issue} />
        ))}
        {issues.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-300">
            Drop issues here
          </div>
        )}
      </div>
    </div>
  );
}

export default function Kanban() {
  const [issues, setIssues] = useState(mockIssues);
  const [activeIssue, setActiveIssue] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = ({ active }) => {
    setActiveIssue(issues.find(i => i.id === active.id) || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveIssue(null);
    if (!over) return;
    const issue = issues.find(i => i.id === active.id);
    if (!issue || issue.status === over.id) return;

    // Optimistic update
    setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: over.id } : i));

    // Call backend when ready:
    // issueApi.updateStatus(issue.id, over.id).catch(() => setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: issue.status } : i)));
  };

  const issuesByStatus = (status) => issues.filter(i => i.status === status);

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kanban Board</h1>
            <p className="text-sm text-gray-400 mt-0.5">Drag and drop issues across columns</p>
          </div>
          <Link to="/issues">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
              <Plus size={14} /> New Issue
            </button>
          </Link>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {COLUMNS.map(col => (
                <Column key={col.id} column={col} issues={issuesByStatus(col.id)} />
              ))}
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeIssue && <IssueCard issue={activeIssue} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>
    </AppLayout>
  );
}
