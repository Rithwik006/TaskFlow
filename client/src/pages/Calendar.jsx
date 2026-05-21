import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const { api } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        const formattedEvents = res.data.map(task => ({
          id: task._id,
          title: task.title,
          start: task.dueDate,
          allDay: true,
          backgroundColor: task.status === 'Completed' ? '#10b981' : (task.status === 'In Progress' ? '#3b82f6' : '#f59e0b'),
          borderColor: 'transparent',
          extendedProps: { ...task }
        }));
        setEvents(formattedEvents);
      } catch (err) {
        toast.error('Failed to load tasks for calendar');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDateClick = (arg) => {
    toast.info(`Add task for ${arg.dateStr}`);
  };

  const handleEventClick = (info) => {
    toast.info(`Task: ${info.event.title}\nStatus: ${info.event.extendedProps.status}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Visualize your deadlines and schedule</p>
        </div>
      </div>

      <div className="calendar-container h-[calc(100vh-250px)]">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="100%"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          editable={true}
          droppable={true}
          eventClassNames="rounded-lg border-none px-2 py-1 text-xs font-semibold cursor-pointer shadow-sm transition-transform hover:scale-105"
        />
      </div>

      <style>{`
        .fc { --fc-border-color: #e2e8f0; --fc-button-bg-color: #3b82f6; --fc-button-border-color: #3b82f6; }
        .dark .fc { --fc-border-color: #1e293b; --fc-page-bg-color: #0f172a; --fc-neutral-bg-color: #1e293b; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: inherit; }
        .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; }
        .fc .fc-button { border-radius: 0.75rem; font-weight: 600; text-transform: capitalize; }
      `}</style>
    </motion.div>
  );
};

export default CalendarPage;
