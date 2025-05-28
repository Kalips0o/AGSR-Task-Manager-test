declare module "@/components/lists/listContent" {
  import { CreateTaskFormData, UpdateTaskData } from "@/shared/schemas/task";
  import { List } from "@/shared/types/list";
  import { Task } from "@/shared/types/task";

  interface ListContentProps {
    list: List;
    isLoading: boolean;
    onCreateTask: (data: CreateTaskFormData) => Promise<void>;
    onDeleteTask: (taskId: string) => Promise<void>;
    onUpdateTask: (data: UpdateTaskData) => Promise<void>;
    onToggleTaskStatus: (task: Task) => Promise<void>;
  }

  export function ListContent(props: ListContentProps): JSX.Element;
}
