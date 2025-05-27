import { NextResponse } from "next/server";
import { z } from "zod";

import { loginSchema } from "../../../../shared/schemas/auth";

export async function POST(request: Request) {
  try {
    // Получаем и валидируем данные из запроса
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Имитация проверки учетных данных
    if (validatedData.email === "test@example.com" && validatedData.password === "123456") {
      return NextResponse.json(
        {
          success: true,
          email: validatedData.email,
        },
        { status: 200 }
      );
    }

    // Если учетные данные неверны
    return NextResponse.json(
      {
        success: false,
        error: "Invalid email or password",
      },
      { status: 401 }
    );
  } catch (error) {
    // Обработка ошибок валидации
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Обработка других ошибок
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
