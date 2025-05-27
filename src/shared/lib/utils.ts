import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRemainingTime({
  estimate,
  startTime,
}: {
  estimate: number;
  startTime: number;
}): string {
  // Проверяем валидность входных данных
  if (!estimate || estimate <= 0 || !startTime || startTime <= 0) {
    return "Invalid time";
  }

  const now = Date.now();
  const endTime = startTime + estimate * 60 * 1000;

  // Если текущее время меньше времени создания, значит что-то не так с системным временем
  if (now < startTime) {
    return "Invalid system time";
  }

  const diff = endTime - now;

  // Если время истекло
  if (diff <= 0) {
    return "Time's up!";
  }

  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getElapsedTime(startTime: number): string {
  // Проверяем валидность входных данных
  if (!startTime || startTime <= 0) {
    return "Invalid time";
  }

  const now = Date.now();

  // Если текущее время меньше времени создания, значит что-то не так с системным временем
  if (now < startTime) {
    return "Invalid system time";
  }

  const diff = now - startTime;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
