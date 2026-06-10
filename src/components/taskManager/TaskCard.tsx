import React, { useState, useRef, useEffect } from 'react';
import type { Task, Subtask, TaskHistoryAction } from './types';
import { CheckIcon, XIcon, EditIcon, GripIcon, PlusIcon } from './Icons';

interface TaskCardProps {
  task: Task;
  updateTask: (id: string, updates: Partial<Task>, action?: TaskHistoryAction, details?: string) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent, id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, updateTask, onDragStart = () => {}, onDragOver = () => {}, onDrop = () => {}, onDragEnd = () => {} }) => {
  const [showCancelJustification, setShowCancelJustification] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState('');
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [showApproval, setShowApproval] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.text);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isFinalState = task.completed || task.isCancelled;

  const getDeadlineClass = () => {
    if (isFinalState) return '';
    const now = new Date().getTime();
    const end = new Date(task.endDate).getTime();
    const diffDays = (end - now) / (1000 * 3600 * 24);
    if (diffDays < 0) return 'deadline-red'; // Overdue but not marked failed yet maybe
    if (diffDays <= 1) return 'deadline-red';
    if (diffDays <= 3) return 'deadline-yellow';
    if (diffDays <= 5) return 'deadline-green';
    return '';
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleComplete = () => {
    if (task.isCancelled || task.completed) return; // Cannot verify if cancelled or already completed
    
    setShowApproval(true);
    setTimeout(() => {
      setShowApproval(false);
      updateTask(task.id, { completed: true }, 'completed');
    }, 1000);
  };

  const handleCancelSubmit = () => {
    if (!cancelReasonInput.trim()) {
      // Must provide reason strictly
      alert('Debes ingresar un motivo para cancelar.');
      return;
    }
    updateTask(task.id, { isCancelled: true, cancelReason: cancelReasonInput, completed: false }, 'cancelled', `Motivo: ${cancelReasonInput}`);
    setShowCancelJustification(false);
  };

  const handleTitleEditSubmit = () => {
    if (editedTitle.trim() && editedTitle !== task.text) {
      updateTask(task.id, { text: editedTitle }, 'edited', `De "${task.text}" a "${editedTitle}"`);
    } else {
      setEditedTitle(task.text); // reset
    }
    setIsEditingTitle(false);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim() || isFinalState) return;
    const newSub: Subtask = { id: Date.now().toString(), text: newSubtaskInput, completed: false };
    updateTask(task.id, { subtasks: [...task.subtasks, newSub] }, 'subtask_added', `Subtarea: "${newSubtaskInput}"`);
    setNewSubtaskInput('');
    setShowSubtaskInput(false);
  };

  const toggleSubtask = (subId: string) => {
    if (isFinalState) return;
    const subtask = task.subtasks.find(s => s.id === subId);
    if (!subtask) return;
    
    const updatedSubtasks = task.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
    
    // Check if all subtasks are now completed
    const allCompleted = updatedSubtasks.every(s => s.completed) && updatedSubtasks.length > 0;
    
    if (allCompleted) {
      setShowApproval(true);
      setTimeout(() => {
        setShowApproval(false);
        updateTask(task.id, { subtasks: updatedSubtasks, completed: true }, 'completed', 'Todas las subtareas completadas');
      }, 1000);
    } else {
      updateTask(task.id, { subtasks: updatedSubtasks }, 'subtask_completed', `Subtarea: "${subtask.text}"`);
    }
  };

  const editSubtask = (subId: string, newText: string) => {
    if (isFinalState) return;
    const updatedSubtasks = task.subtasks.map(s => s.id === subId ? { ...s, text: newText } : s);
    // Don't pass action here to avoid spamming history
    updateTask(task.id, { subtasks: updatedSubtasks }, 'subtask_edited', '');
  };

  const handleSubtaskBlur = (_subId: string, currentText: string) => {
    if (isFinalState || !currentText.trim()) return;
    updateTask(task.id, {}, 'subtask_edited', `Subtarea editada: "${currentText}"`);
  };

  return (
    <div 
      id={`task-${task.id}`}
      className={`tm-task-card tm-anim-enter priority-${task.priority} ${task.completed ? 'completed' : ''} ${task.isCancelled ? 'cancelled' : ''} ${getDeadlineClass()}`}
      draggable={!isFinalState}
      onDragStart={(e) => !isFinalState && onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => !isFinalState && onDrop(e, task.id)}
      onDragEnd={(e) => !isFinalState && onDragEnd(e, task.id)}
    >
      {showApproval && (
        <div className="tm-approval-anim">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#2ed573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      )}

      {showCancelJustification && (
        <div className="tm-cancel-overlay">
          <h4>¿Por qué cancelas esta misión?</h4>
          <input 
            autoFocus
            type="text" 
            className="tm-cancel-input" 
            placeholder="Motivo estrictamente requerido..."
            value={cancelReasonInput}
            onChange={(e) => setCancelReasonInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCancelSubmit()}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="tm-btn" style={{ background: '#ff4757', color: 'white' }} onClick={handleCancelSubmit}>Confirmar</button>
            <button className="tm-btn" style={{ background: '#555', color: 'white' }} onClick={() => setShowCancelJustification(false)}>Atrás</button>
          </div>
        </div>
      )}

      <div className="tm-task-header">
        <div className="tm-task-title-group" style={{ justifyContent: 'center' }}>
          {!isFinalState && (
            <div className="tm-drag-handle">
              <GripIcon />
            </div>
          )}
          <div style={{ flex: 1, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                className="tm-inline-edit-input"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleEditSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleEditSubmit()}
              />
            ) : (
              <h3 className="tm-task-text" onDoubleClick={(e) => { e.stopPropagation(); !isFinalState && setIsEditingTitle(true); }}>{task.text}</h3>
            )}
            <div className="tm-task-meta" style={{ justifyContent: 'center' }}>
              <span>Fin: {new Date(task.endDate).toLocaleString()}</span>
              {task.isCancelled && <span style={{ color: '#ff4757' }}>Cancelada: {task.cancelReason}</span>}
            </div>
          </div>
        </div>

        {!isFinalState && (
          <div className="tm-task-actions">
            <button className="tm-icon-btn done" onClick={(e) => { e.stopPropagation(); handleComplete(); }} title="Aprobar">
              <CheckIcon />
            </button>
            <button className="tm-icon-btn edit" onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }} title="Editar">
              <EditIcon />
            </button>
            <button className="tm-icon-btn cancel" onClick={(e) => { e.stopPropagation(); setShowCancelJustification(true); }} title="Cancelar">
              <XIcon />
            </button>
          </div>
        )}
      </div>

      <div className="tm-subtasks">
        <div className="tm-subtasks-grid">
          {task.subtasks.map(sub => (
            <div key={sub.id} className="tm-subtask-item" style={{ opacity: sub.completed ? 0.5 : 1 }}>
              <button 
                className={`tm-subtask-check ${sub.completed ? 'checked' : ''}`} 
                onClick={(e) => { e.stopPropagation(); toggleSubtask(sub.id); }}
                disabled={isFinalState}
              >
                {sub.completed && <CheckIcon />}
              </button>
              <input 
                className="tm-subtask-edit-input"
                value={sub.text}
                disabled={isFinalState}
                onChange={(e) => editSubtask(sub.id, e.target.value)}
                onBlur={() => handleSubtaskBlur(sub.id, sub.text)}
                onClick={e => e.stopPropagation()}
                style={{ textDecoration: sub.completed ? 'line-through' : 'none' }}
              />
            </div>
          ))}
        </div>
        
        {!isFinalState && (
          showSubtaskInput ? (
            <div className="tm-subtask-input-wrapper" onClick={e => e.stopPropagation()}>
              <input 
                autoFocus
                type="text" 
                className="tm-subtask-input" 
                placeholder="Nueva subtarea..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              />
              <button className="tm-btn" style={{ padding: '8px 12px' }} onClick={handleAddSubtask}>Add</button>
            </div>
          ) : (
            <button className="tm-icon-btn" style={{ alignSelf: 'center', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }} onClick={(e) => { e.stopPropagation(); setShowSubtaskInput(true); }}>
              <PlusIcon /> Subtarea
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TaskCard;
