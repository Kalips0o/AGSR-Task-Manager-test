import { NextResponse } from "next/server";
import { z } from "zod";

import { taskSchema } from "@/shared/schemas/task";
import { tasksService } from "@/shared/services/tasks";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    const response = await tasksService.createTask(validatedData);

    if (!response.success) {
      return NextResponse.json({ success: false, error: response.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
