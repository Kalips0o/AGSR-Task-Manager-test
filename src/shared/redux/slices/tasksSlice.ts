import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { CreateTaskData, CreateListData, UpdateTaskData } from "../../schemas/task";
import { tasksService } from "../../services/tasks";
import type { Task, TaskList, TasksState } from "../../types/task";
import type { RootState } from "../index";

const initialState: TasksState = {
  lists: [],
  isLoading: false,
  error: null,
};

export const fetchLists = createAsyncThunk<TaskList[], void, { rejectValue: string }>(
  "tasks/fetchLists",
  async (_, { rejectWithValue }) => {
    const response = await tasksService.getLists();
    if (!response.success) {
      return rejectWithValue(response.error ?? "Failed to fetch lists");
    }
    return response.data!;
  }
);

export const createList = createAsyncThunk<TaskList, CreateListData, { rejectValue: string }>(
  "tasks/createList",
  async (data, { rejectWithValue }) => {
    const response = await tasksService.createList(data);
    if (!response.success) {
      return rejectWithValue(response.error ?? "Failed to create list");
    }
    return response.data!;
  }
);

export const createTask = createAsyncThunk<Task, CreateTaskData, { rejectValue: string }>(
  "tasks/createTask",
  async (data, { rejectWithValue }) => {
    const response = await tasksService.createTask(data);
    if (!response.success) {
      return rejectWithValue(response.error ?? "Failed to create task");
    }
    return response.data!;
  }
);

export const updateTask = createAsyncThunk<Task, UpdateTaskData, { rejectValue: string }>(
  "tasks/updateTask",
  async (data, { rejectWithValue }) => {
    const response = await tasksService.updateTask(data);
    if (!response.success) {
      return rejectWithValue(response.error ?? "Failed to update task");
    }
    return response.data!;
  }
);

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    const response = await tasksService.deleteTask(id);
    if (!response.success) {
      return rejectWithValue(response.error ?? "Failed to delete task");
    }
    return id;
  }
);

export const deleteList = createAsyncThunk<string, string, { rejectValue: string }>(
  "tasks/deleteList",
  async (id, { rejectWithValue }) => {
    const response = await tasksService.deleteList(id);
    if (!response.success) {
      return rejectWithValue(response.error ?? "Failed to delete list");
    }
    return id;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lists
      .addCase(fetchLists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.lists = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch lists";
      })
      // Create List
      .addCase(createList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to create list";
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const list = state.lists.find((l) => l.id === action.payload.listId);
        if (list) {
          list.tasks.push(action.payload);
        }
        state.isLoading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to create task";
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const list = state.lists.find((l) => l.id === action.payload.listId);
        if (list) {
          const taskIndex = list.tasks.findIndex((t) => t.id === action.payload.id);
          if (taskIndex !== -1) {
            list.tasks[taskIndex] = action.payload;
          }
        }
        state.isLoading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to update task";
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const list = state.lists.find((l) => l.tasks.some((t) => t.id === action.payload));
        if (list) {
          list.tasks = list.tasks.filter((t) => t.id !== action.payload);
        }
        state.isLoading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to delete task";
      })
      // Delete List
      .addCase(deleteList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((l) => l.id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to delete list";
      });
  },
});

// Selectors
export const selectTasks = (state: RootState) => state.tasks;
export const selectLists = (state: RootState) => selectTasks(state).lists;
export const selectTasksLoading = (state: RootState) => selectTasks(state).isLoading;
export const selectTasksError = (state: RootState) => selectTasks(state).error;

export const selectListById = (state: RootState, listId: string) =>
  selectLists(state).find((list) => list.id === listId);

export const selectTasksByListId = (state: RootState, listId: string) =>
  selectListById(state, listId)?.tasks ?? [];

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
