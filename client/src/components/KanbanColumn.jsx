import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ id, title, tasks, onAddTask, onEdit }) => {
  const taskIds = useMemo(() => tasks.map((t) => t._id), [tasks]);

  return (
    <div className="flex flex-col w-full min-w-[300px] bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl p-4 border border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(id)}
          className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors shadow-sm"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 kanban-column">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEdit} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
