import React, { useState, useEffect } from 'react';
import SpaceBackground from './SpaceBackground';
import TaskCard from './TaskCard';
import CalendarView from './CalendarView';
import TaskHistoryView from './TaskHistoryView';
import TypewriterPunchText from './TypewriterPunchText';
import type { Task, Priority, TaskHistoryAction } from './types';
import { PlusIcon, ListIcon, CalendarIcon, HistoryIcon } from './Icons';
import './taskManager.css';

const TaskManagerApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [inputPriority, setInputPriority] = useState<Priority>('yellow');
  const [inputEndDate, setInputEndDate] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'history'>('list');
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'warning' | 'error' | 'success'} | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Default dates to today
  useEffect(() => {
    const today = new Date();
    // Default end date = end of today
    const endToday = new Date(today);
    endToday.setHours(23, 59, 0, 0);
    const endIso = new Date(endToday.getTime() - (endToday.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    
    setInputEndDate(endIso);
  }, []);

  // Check for 'Tarea Incumplida' (Failed tasks)
  useEffect(() => {
    const checkFailedTasks = () => {
      const now = new Date();
      let updated = false;
      
      setTasks(prevTasks => {
        const newTasks = prevTasks.map(t => {
          if (!t.completed && !t.isCancelled) {
            const endDate = new Date(t.endDate);
            const hasFailedHistory = t.history.some(h => h.action === 'failed');
            if (now > endDate && !hasFailedHistory) {
              updated = true;
              return {
                ...t,
                history: [
                  {
                    id: Date.now().toString() + '-' + Math.random(),
                    date: now.toISOString(),
                    action: 'failed' as TaskHistoryAction,
                    taskNameAtTime: t.text
                  },
                  ...t.history
                ]
              };
            }
          }
          return t;
        });
        return updated ? newTasks : prevTasks;
      });
    };

    checkFailedTasks();
    const interval = setInterval(checkFailedTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddTask = () => {
    if (!inputText.trim()) return;
    const now = new Date().toISOString();
    const newTask: Task = {
      id: Date.now().toString(),
      text: inputText,
      completed: false,
      priority: inputPriority,
      startDate: now,
      endDate: inputEndDate,
      deadline: inputEndDate, // for backward compatibility
      subtasks: [],
      isCancelled: false,
      cancelReason: '',
      history: [{
        id: Date.now().toString() + '-hist',
        date: now,
        action: 'created',
        taskNameAtTime: inputText
      }]
    };
    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  const updateTask = (id: string, updates: Partial<Task>, action?: TaskHistoryAction, details?: string) => {
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === id) {
        const updatedTask = { ...t, ...updates };
        if (action) {
          updatedTask.history = [
            {
              id: Date.now().toString() + '-' + Math.random(),
              date: new Date().toISOString(),
              action,
              details,
              taskNameAtTime: t.text
            },
            ...updatedTask.history
          ];
        }
        return updatedTask;
      }
      return t;
    }));
  };

  // We removed drag-and-drop from the main list since the user requested:
  // "en la lista de la tarea no se mueva las tareas"
  // The calendar will handle its own drag and drop.

  const handlePriorityChange = (p: Priority) => {
    setInputPriority(p);
    const pName = p === 'red' ? 'Crítica' : p === 'yellow' ? 'Importante' : 'Normal';
    showNotification(`Prioridad cambiada a ${pName}`, 'info');
  };

  // Filter tasks for active list vs history
  const activeTasks = tasks.filter(t => !t.completed && !t.isCancelled && !t.history.some(h => h.action === 'failed'));

  // Get tasks that are expiring soon for notifications
  const expiringTasks = activeTasks.filter(t => {
    const diff = new Date(t.endDate).getTime() - new Date().getTime();
    const days = diff / (1000 * 3600 * 24);
    return days >= 0 && days <= 3;
  });

  return (
    <div className="tm-container">
      <SpaceBackground />
      
      <div className="tm-content">
        <div className="tm-header">
          <h1>TaskFlow Universe</h1>
          <p>Organiza tus ideas a la velocidad de la luz</p>
        </div>

        {/* Input Area */}
        <div className="tm-input-wrapper">
          {/* Big Typing Text effect on top */}
          <TypewriterPunchText text={inputText} />
          
          <input
            type="text"
            className="tm-main-input"
            placeholder="¿Qué misión tenemos hoy?..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          
          <div className="tm-input-controls">
            <div className="tm-priority-selector">
              <span title="Crítica" className={`tm-traffic-light red ${inputPriority === 'red' ? 'active' : ''}`} onClick={() => handlePriorityChange('red')}></span>
              <span title="Importante" className={`tm-traffic-light yellow ${inputPriority === 'yellow' ? 'active' : ''}`} onClick={() => handlePriorityChange('yellow')}></span>
              <span title="Normal" className={`tm-traffic-light green ${inputPriority === 'green' ? 'active' : ''}`} onClick={() => handlePriorityChange('green')}></span>
            </div>
            
            <div className="tm-date-selectors">
              <div className="tm-date-field">
                <label>Fin:</label>
                <input 
                  type="datetime-local" 
                  className="tm-date-input"
                  value={inputEndDate}
                  onChange={(e) => setInputEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <button className="tm-btn" onClick={handleAddTask}>
              <PlusIcon /> Agregar Misión
            </button>
          </div>
        </div>

        <div className="tm-view-toggle">
          {notification && (
            <div className={`tm-notification tm-notif-${notification.type} tm-anim-enter`}>
              {notification.message}
            </div>
          )}
          <button className={`tm-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <ListIcon /> Tareas Activas
          </button>
          <button className={`tm-view-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>
            <CalendarIcon /> Calendario
          </button>
          <button className={`tm-view-btn ${viewMode === 'history' ? 'active' : ''}`} onClick={() => setViewMode('history')}>
            <HistoryIcon /> Historial
          </button>
        </div>

        {/* List View (Only Active Tasks) */}
        {viewMode === 'list' && (
          <div className="tm-task-list">
            {activeTasks.map(task => (
              <div onClick={() => setSelectedTask(task)} key={task.id} style={{ cursor: 'pointer' }}>
                <TaskCard 
                  task={task} 
                  updateTask={updateTask}
                />
              </div>
            ))}
            {activeTasks.length === 0 && (
              <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>
                No hay misiones activas en esta galaxia.
              </div>
            )}
          </div>
        )}

        {/* Calendar View (All tasks) */}
        {viewMode === 'calendar' && <CalendarView tasks={tasks} updateTask={updateTask} />}

        {/* History View */}
        {viewMode === 'history' && <TaskHistoryView tasks={tasks} />}

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="tm-modal-overlay" onClick={() => setSelectedTask(null)}>
            <div className="tm-modal-content" onClick={e => e.stopPropagation()}>
              <div className="tm-modal-border" />
              <button className="tm-modal-close" onClick={() => setSelectedTask(null)}>×</button>
              
              <div className="card_title__container">
                <h2 className="tm-modal-title">{selectedTask.text}</h2>
                <p className="tm-modal-paragraph">Descripción y detalles de la tarea a realizar.</p>
              </div>
              
              <hr className="tm-modal-line" />
              
              <textarea 
                className="tm-modal-textarea-custom"
                placeholder="Escribe el paso a paso o los detalles de cómo se hace esta tarea..."
                value={selectedTask.description || ''}
                onChange={e => {
                  setSelectedTask({ ...selectedTask, description: e.target.value });
                }}
                onBlur={e => {
                  if (e.target.value !== tasks.find(t => t.id === selectedTask.id)?.description) {
                    updateTask(selectedTask.id, { description: e.target.value }, 'edited', 'Descripción actualizada');
                  }
                }}
              />

              <hr className="tm-modal-line" />
              
              <ul className="tm-modal-list">
                <li className="tm-modal-list-item">
                  <span className="check">
                    <svg fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                    </svg>
                  </span>
                  <span className="list-text"><strong>Prioridad:</strong> {selectedTask.priority === 'red' ? 'Crítica' : selectedTask.priority === 'yellow' ? 'Importante' : 'Normal'}</span>
                </li>
                <li className="tm-modal-list-item">
                  <span className="check">
                    <svg fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                    </svg>
                  </span>
                  <span className="list-text"><strong>Fin:</strong> {new Date(selectedTask.endDate).toLocaleString()}</span>
                </li>
                <li className="tm-modal-list-item">
                  <span className="check">
                    <svg fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                    </svg>
                  </span>
                  <span className="list-text"><strong>Estado:</strong> {selectedTask.completed ? 'Completada' : selectedTask.isCancelled ? 'Cancelada' : 'Activa'}</span>
                </li>
              </ul>
              
              <button className="tm-modal-button" onClick={() => setSelectedTask(null)}>Guardar y Cerrar</button>
            </div>
          </div>
        )}

        {/* Expiring Tasks Notifications */}
        <div className="tm-corner-notifications">
          {expiringTasks.map(t => {
            const diff = new Date(t.endDate).getTime() - new Date().getTime();
            const days = Math.ceil(diff / (1000 * 3600 * 24));
            const hours = Math.ceil(diff / (1000 * 3600));
            return (
              <div key={t.id} className={`tm-corner-card deadline-${days <= 1 ? 'red' : 'yellow'} tm-anim-enter`}>
                <div className="tm-corner-title">{t.text}</div>
                <div className="tm-corner-time">
                  Caduque en: {days > 1 ? `${days} días` : `${hours} horas`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskManagerApp;
