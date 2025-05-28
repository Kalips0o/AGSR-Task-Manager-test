declare module "@/shared/hooks/useTaskOperations" {
  export function useTaskOperations(): {
    editingTask: Task | null;
    setEditingTask: (task: Task | null) => void;
    handleCreateTask: (data: CreateTaskFormData) => Promise<void>;
    handleDeleteTask: (taskId: string) => Promise<void>;
    handleUpdateTask: (data: UpdateTaskData) => Promise<void>;
    handleToggleTaskStatus: (task: Task) => Promise<void>;
  };
}

declare module "@/shared/hooks/useListData" {
  export function useListData(listId: string): {
    list: List | null;
    isLoading: boolean;
    error: string | null;
  };
}
