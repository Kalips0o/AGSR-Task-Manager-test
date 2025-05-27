import React, { useEffect, useState, useRef, useCallback } from "react";

import { getRemainingTime, getElapsedTime } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

import { Typography } from "./typography";

interface TaskTimerProps {
  createdAt: string;
  timeToComplete?: number;
  className?: string;
  isDone?: boolean;
}

// Константы для состояний таймера
const TIMER_STATES = {
  CALCULATING: "Calculating...",
  NO_LIMIT: "No time limit",
  TIME_UP: "Time's up!",
} as const;

type TimerState = (typeof TIMER_STATES)[keyof typeof TIMER_STATES] | string;

export const TaskTimer = React.memo(function TaskTimer({
  createdAt,
  timeToComplete,
  className,
  isDone,
}: TaskTimerProps) {
  const [displayTime, setDisplayTime] = useState<TimerState>(TIMER_STATES.CALCULATING);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Используем useRef для хранения состояния таймера, чтобы избежать лишних ререндеров
  const timerStateRef = useRef({
    startTime: new Date(createdAt).getTime(),
    prevTimeToComplete: timeToComplete,
  });

  // Функция очистки интервала
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Функция обновления отображаемого времени
  const updateDisplay = useCallback(() => {
    const { startTime } = timerStateRef.current;

    if (!timeToComplete) {
      setDisplayTime(TIMER_STATES.NO_LIMIT);
      setIsTimeUp(false);
      return true;
    }

    if (isDone) {
      setDisplayTime(`Time spent: ${getElapsedTime(startTime)}`);
      return true;
    }

    const remaining = getRemainingTime({
      estimate: timeToComplete,
      startTime: startTime,
    });

    setDisplayTime(remaining);
    const timeIsUp = remaining === TIMER_STATES.TIME_UP;
    setIsTimeUp(timeIsUp);

    return timeIsUp;
  }, [timeToComplete, isDone]);

  // Функция сброса таймера
  const resetTimer = useCallback(() => {
    clearTimerInterval();
    timerStateRef.current = {
      startTime: new Date(createdAt).getTime(),
      prevTimeToComplete: timeToComplete,
    };
    setIsTimeUp(false);
    setDisplayTime(TIMER_STATES.CALCULATING);
  }, [createdAt, timeToComplete, clearTimerInterval]);

  useEffect(() => {
    // Проверяем необходимость сброса таймера
    const needsReset =
      timerStateRef.current.startTime !== new Date(createdAt).getTime() ||
      timerStateRef.current.prevTimeToComplete !== timeToComplete;

    if (needsReset) {
      resetTimer();
    }

    // Первоначальное обновление
    const shouldStop = updateDisplay();

    // Запускаем интервал только если нужно
    if (!isDone && timeToComplete && !shouldStop && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const shouldStopUpdate = updateDisplay();
        if (shouldStopUpdate) {
          clearTimerInterval();
        }
      }, 1000);
    }

    return clearTimerInterval;
  }, [createdAt, timeToComplete, isDone, resetTimer, updateDisplay, clearTimerInterval]);

  // Определяем цвет текста
  const textColor = isDone ? "text-green-600" : isTimeUp ? "text-red-600" : "text-blue-600";

  return (
    <Typography className={cn(textColor, className)} variant="headline-3-semibold">
      {displayTime}
    </Typography>
  );
});

TaskTimer.displayName = "TaskTimer";
