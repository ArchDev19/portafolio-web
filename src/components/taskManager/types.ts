export type Priority = 'red' | 'yellow' | 'green';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export type TaskHistoryAction = 'created' | 'edited' | 'subtask_added' | 'subtask_completed' | 'subtask_edited' | 'completed' | 'cancelled' | 'failed';

export interface TaskHistoryEntry {
  id: string;
  date: string;
  action: TaskHistoryAction;
  details?: string;
  taskNameAtTime: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  startDate: string; // YYYY-MM-DDTHH:mm format
  endDate: string; // YYYY-MM-DDTHH:mm format
  deadline: string; // Keep for backward compatibility or use endDate
  description?: string;
  subtasks: Subtask[];
  isCancelled: boolean;
  cancelReason: string;
  history: TaskHistoryEntry[];
}
