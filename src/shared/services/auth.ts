import { LoginFormData } from "../schemas/auth";
import { AuthResponse } from "../types/auth";

export const authService = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Пример локальной валидации
    if (credentials.email === "test@example.com" && credentials.password === "123456") {
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid email or password",
    };
  },
};
