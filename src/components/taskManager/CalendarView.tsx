import React, { useState, useRef } from 'react';
import type { Task, TaskHistoryAction } from './types';

interface CalendarViewProps {
  tasks: Task[];
  updateTask: (id: string, updates: Partial<Task>, action?: TaskHistoryAction, details?: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, updateTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- Pan & Zoom / Inertia Camera Logic ---
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scrollPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const startPan = (e: React.MouseEvent) => {
    // Only pan if clicking on empty space or the calendar background, not tasks
    if ((e.target as HTMLElement).closest('.tm-cal-item')) return;
    
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    if (viewportRef.current) {
      scrollPos.current = { x: viewportRef.current.scrollLeft, y: viewportRef.current.scrollTop };
    }
    velocity.current = { x: 0, y: 0 };
    lastTime.current = performance.now();
  };

  const pan = (e: React.MouseEvent) => {
    if (!isDragging.current || !viewportRef.current) return;
    
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    
    const now = performance.now();
    const dt = now - lastTime.current;
    
    if (dt > 0) {
      velocity.current = { x: -dx / dt, y: -dy / dt }; // Velocity = distance / time
    }
    
    lastTime.current = now;
    startPos.current = { x: e.clientX, y: e.clientY };
    
    viewportRef.current.scrollLeft += -dx;
    viewportRef.current.scrollTop += -dy;
  };

  const endPan = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // Start inertia loop
    const applyInertia = () => {
      if (!viewportRef.current) return;
      
      viewportRef.current.scrollLeft += velocity.current.x * 16; // approx 60fps dt
      viewportRef.current.scrollTop += velocity.current.y * 16;
      
      // Friction
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;
      
      if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
        animationFrameId.current = requestAnimationFrame(applyInertia);
      }
    };
    
    applyInertia();
  };

  // --- Calendar Grid Logic ---
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Render 3 months: Prev, Current, Next to allow panning
  const renderMonth = (monthOffset: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
    const firstDay = targetDate.getDay();
    
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div key={monthOffset} className="tm-calendar-month-block">
        <h3 className="tm-calendar-month-title">{monthNames[targetDate.getMonth()]} {targetDate.getFullYear()}</h3>
        <div className="tm-calendar-month-grid">
          {dayNames.map(d => <div key={d} className="tm-calendar-weekday">{d}</div>)}
          {blanks.map(b => <div key={`blank-${b}`} className="tm-calendar-cell empty"></div>)}
          {daysArray.map(day => {
            
            const dayTasks = tasks.filter(t => {
              const d = new Date(t.endDate);
              return d.getDate() === day && d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear();
            });

            return (
              <div 
                key={day} 
                className="tm-calendar-cell"
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('taskId');
                  if (!taskId) return;
                  const task = tasks.find(t => t.id === taskId);
                  if (!task || task.completed || task.isCancelled) return;
                  
                  const originalEnd = new Date(task.endDate);
                  const newEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), day, originalEnd.getHours(), originalEnd.getMinutes());
                  const originalStart = new Date(task.startDate);
                  
                  if (newEnd < originalStart) {
                    alert("La fecha final no puede ser anterior a la fecha de inicio.");
                    return;
                  }
                  
                  const pad = (n: number) => n.toString().padStart(2, '0');
                  const endIso = `${newEnd.getFullYear()}-${pad(newEnd.getMonth()+1)}-${pad(newEnd.getDate())}T${pad(newEnd.getHours())}:${pad(newEnd.getMinutes())}`;

                  updateTask(taskId, { endDate: endIso }, 'edited', `Fecha final actualizada a ${newEnd.toLocaleDateString()}`);
                }}
              >
                <div className="tm-calendar-day-number">{day}</div>
                <div className="tm-calendar-day-tasks">
                  {dayTasks.map(task => {
                    const isFinal = task.completed || task.isCancelled;
                    const timeStrStart = new Date(task.startDate).toLocaleDateString();
                    const timeStrEnd = new Date(task.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div 
                        key={task.id} 
                        className={`tm-cal-item priority-${task.priority}`} 
                        style={{ opacity: isFinal ? 0.5 : 1, textDecoration: isFinal ? 'line-through' : 'none' }}
                        draggable={!isFinal}
                        onDragStart={(e) => {
                          e.stopPropagation();
                          e.dataTransfer.setData('taskId', task.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        title={task.text}
                      >
                        <div style={{fontSize: '0.65rem', opacity: 0.8}}>Inicio: {timeStrStart}</div>
                        <strong>Fin: {timeStrEnd}</strong> - {task.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="tm-calendar-full">
      <div className="tm-calendar-header-controls">
        <button className="tm-btn" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>&lt; Mes Anterior</button>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Arrastra el fondo para explorar (Inercia activada)</p>
        <button className="tm-btn" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>Mes Siguiente &gt;</button>
      </div>

      <div 
        className="tm-calendar-viewport" 
        ref={viewportRef}
        onMouseDown={startPan}
        onMouseMove={pan}
        onMouseUp={endPan}
        onMouseLeave={endPan}
      >
        <div className="tm-calendar-world" ref={worldRef}>
          {renderMonth(-1)}
          {renderMonth(0)}
          {renderMonth(1)}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
