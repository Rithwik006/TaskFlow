import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Calendar, Flag, Tag } from 'lucide-react';
import { clsx } from 'clsx';

const TaskCard = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-slate-200 dark:bg-slate-800 h-32 rounded-2xl border-2 border-dashed border-primary-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary-500/50 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={clsx(
          "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Edit Task"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {task.tags?.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300">
            <Tag size={10} /> {tag}
          </span>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Calendar size={14} />
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
        </div>
        <div className="flex -space-x-2">
          <img 
            src={task.assignedTo?.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo?.name || 'User'}`} 
            className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-slate-200 dark:ring-slate-700"
            alt="Assignee"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
