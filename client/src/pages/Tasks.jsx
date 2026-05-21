import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, Calendar, Tag, AlertCircle, ArrowUpDown, Edit, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const { api } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, title, status, priority
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleUpdateStatus = async (taskId, currentStatus) => {
    const nextStatusMap = {
      'Pending': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Pending'
    };
    const nextStatus = nextStatusMap[currentStatus] || 'Pending';
    try {
      await api.put(`/tasks/${taskId}`, { status: nextStatus });
      toast.success(`Task status updated to ${nextStatus}`);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  // Filter and Sort Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Handle nested or date properties
    if (sortBy === 'dueDate') {
      valA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      valB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
      default: return 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={18} className="text-green-500" />;
      case 'In Progress': return <Play size={18} className="text-blue-500 fill-blue-500" />;
      default: return <Calendar size={18} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-800';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">Search, filter, and detail your production list</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Filters Box */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">📋 To Do</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Completed">✅ Done</option>
            </select>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none w-full sm:w-auto"
          >
            <option value="All">All Priorities</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => toggleSort('title')}>
                  <div className="flex items-center gap-1.5">Task <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => toggleSort('status')}>
                  <div className="flex items-center gap-1.5">Status <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => toggleSort('priority')}>
                  <div className="flex items-center gap-1.5">Priority <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => toggleSort('dueDate')}>
                  <div className="flex items-center gap-1.5">Due Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No tasks found matching filters.
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-5">
                      <div>
                        <p className={`font-bold text-sm text-slate-900 dark:text-white ${task.status === 'Completed' ? 'line-through opacity-50' : ''}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 mt-1 max-w-sm truncate">{task.description}</p>
                        )}
                        <div className="flex gap-1.5 mt-2">
                          {task.tags && task.tags.map((tag, idx) => (
                            <span key={idx} className="flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              <Tag size={8} /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleUpdateStatus(task._id, task.status)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(task.status)} transition-transform hover:scale-105 active:scale-95`}
                      >
                        {getStatusIcon(task.status)}
                        {task.status}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                    </td>
                    <td className="px-6 py-5">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={task.assignedTo.avatar || `https://ui-avatars.com/api/?name=${task.assignedTo.name}&background=random`}
                            className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800"
                            alt={task.assignedTo.name}
                          />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{task.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleEditClick(task)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onTaskSaved={fetchTasks}
      />
    </div>
  );
};

export default Tasks;
