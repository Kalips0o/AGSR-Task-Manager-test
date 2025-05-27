export interface Task {
  id: string;
  title: string;
  description?: string;
  timeToComplete?: number;
  done: boolean;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface TasksState {
  lists: TaskList[];
  isLoading: boolean;
  error: string | null;
}
