import React from 'react';
import type { Task } from './types';

interface TaskHistoryViewProps {
  tasks: Task[];
}

const TaskHistoryView: React.FC<TaskHistoryViewProps> = ({ tasks }) => {
  // Extract all history entries and sort by date descending
  const allHistory = tasks.flatMap(task => 
    task.history.map(h => ({
      ...h,
      taskPriority: task.priority
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allHistory.length === 0) {
    return <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>No hay historial registrado.</div>;
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'created': return 'Misión creada';
      case 'edited': return 'Misión editada';
      case 'completed': return 'Misión completada/aprobada';
      case 'cancelled': return 'Misión cancelada';
      case 'subtask_added': return 'Subtarea agregada';
      case 'subtask_completed': return 'Subtarea completada';
      case 'subtask_edited': return 'Subtarea editada';
      case 'failed': return 'Tarea Incumplida';
      default: return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return '#4facfe';
      case 'completed': return '#2ed573';
      case 'cancelled': return '#ff4757';
      case 'failed': return '#ff4757'; // Red for failed as well
      default: return '#ffa502';
    }
  };

  return (
    <div className="tm-history-container">
      <div className="tm-history-timeline">
        {allHistory.map((item, i) => (
          <div key={i} className="tm-history-item tm-anim-enter" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="tm-history-dot" style={{ backgroundColor: getActionColor(item.action) }}></div>
            <div className="tm-history-content">
              <div className="tm-history-time">{new Date(item.date).toLocaleString()}</div>
              <div className="tm-history-title">
                <span style={{ color: getActionColor(item.action) }}>{getActionText(item.action)}</span>
                {' - '}
                <span className={`priority-${item.taskPriority}-text`}>{item.taskNameAtTime || 'Misión'}</span>
              </div>
              {item.details && <div className="tm-history-details">{item.details}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskHistoryView;
