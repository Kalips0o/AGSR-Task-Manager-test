import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { taskSchema, taskListSchema, updateTaskSchema } from "@/shared/schemas/task";
import type { Task, TaskList } from "@/shared/types/task";

// Глобальное хранилище
declare global {
  let lists: TaskList[];
}

if (!global.lists) {
  global.lists = [
    {
      id: "1",
      title: "Work Tasks",
      tasks: [
        {
          id: "t1",
          title: "Make a commit",
          done: false,
          listId: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

// GET /api/tasks?type=lists - получить все списки
// GET /api/tasks?listId=123 - получить задачи списка
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const listId = searchParams.get("listId");

  if (type === "lists") {
    return NextResponse.json(global.lists);
  }

  if (listId) {
    const list = global.lists.find((l) => l.id === listId);
    if (!list) {
      return NextResponse.json({ success: false, error: "List not found" }, { status: 404 });
    }
    return NextResponse.json(list.tasks);
  }

  return NextResponse.json(
    { success: false, error: "Invalid request parameters" },
    { status: 400 }
  );
}

// POST /api/tasks?type=list - создать новый список
// POST /api/tasks - создать новую задачу
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const body = await request.json();

    if (type === "list") {
      const validatedData = taskListSchema.parse(body);
      const newList: TaskList = {
        id: uuidv4(),
        title: validatedData.title,
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      global.lists.push(newList);
      return NextResponse.json(newList, { status: 201 });
    }

    const validatedData = taskSchema.parse(body);
    const list = global.lists.find((l) => l.id === validatedData.listId);
    if (!list) {
      return NextResponse.json({ success: false, error: "List not found" }, { status: 404 });
    }

    const newTask: Task = {
      id: uuidv4(),
      title: validatedData.title,
      description: validatedData.description,
      timeToComplete: validatedData.timeToComplete,
      done: false,
      listId: validatedData.listId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.tasks.push(newTask);
    list.updatedAt = new Date().toISOString();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/tasks?id=123&type=list - обновить список
// PATCH /api/tasks - обновить задачу
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    const body = await request.json();

    if (type === "list") {
      if (!id) {
        return NextResponse.json({ success: false, error: "List ID is required" }, { status: 400 });
      }

      const list = global.lists.find((l) => l.id === id);
      if (!list) {
        return NextResponse.json({ success: false, error: "List not found" }, { status: 404 });
      }

      if (!body.title || typeof body.title !== "string") {
        return NextResponse.json(
          { success: false, error: "Title is required and must be a string" },
          { status: 400 }
        );
      }

      list.title = body.title.trim();
      list.updatedAt = new Date().toISOString();

      return NextResponse.json({ success: true });
    }

    const validatedData = updateTaskSchema.parse(body);
    const list = global.lists.find((l) => l.tasks.some((t) => t.id === validatedData.id));
    if (!list) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const task = list.tasks.find((t) => t.id === validatedData.id)!;
    const updatedTask: Task = {
      ...task,
      ...validatedData,
      createdAt:
        validatedData.timeToComplete !== task.timeToComplete
          ? new Date().toISOString()
          : task.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const taskIndex = list.tasks.findIndex((t) => t.id === validatedData.id);
    list.tasks[taskIndex] = updatedTask;
    list.updatedAt = new Date().toISOString();

    return NextResponse.json(updatedTask);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/tasks?id=123&type=list - удалить список
// DELETE /api/tasks?id=123 - удалить задачу
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    if (type === "list") {
      const initialLength = global.lists.length;
      const listToDelete = global.lists.find((list) => list.id === id);

      if (!listToDelete) {
        return NextResponse.json({ success: false, error: "List not found" }, { status: 404 });
      }

      const index = global.lists.findIndex((list) => list.id === id);
      global.lists.splice(index, 1);

      if (global.lists.length === initialLength) {
        return NextResponse.json(
          { success: false, error: "Failed to delete list" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "List deleted successfully" },
        { status: 200 }
      );
    }

    const list = global.lists.find((l) => l.tasks.some((t) => t.id === id));
    if (!list) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const initialTaskCount = list.tasks.length;
    list.tasks = list.tasks.filter((t) => t.id !== id);

    if (list.tasks.length === initialTaskCount) {
      return NextResponse.json(
        { success: false, error: "Task not found in list" },
        { status: 404 }
      );
    }

    list.updatedAt = new Date().toISOString();

    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
