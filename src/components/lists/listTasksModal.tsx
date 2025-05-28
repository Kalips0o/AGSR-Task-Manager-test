import React from "react";

import { Modal } from "@/shared/components/ui/modal";
import { Typography } from "@/shared/components/ui/typography";
import type { Task } from "@/shared/types/task";

interface ListTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  listTitle: string;
}

export function ListTasksModal({ isOpen, onClose, tasks, listTitle }: ListTasksModalProps) {
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Подсчет статистики
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const inProgressTasks = totalTasks - completedTasks;

  return (
    <Modal isOpen={isOpen} title={`Tasks in "${listTitle}"`} onClose={onClose}>
      <div className="space-y-4">
        {/* Статистика задач */}
        <div className="grid grid-cols-3 gap-4 py-2 px-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Typography className="text-blue-600 text-xs" variant="body-m-regular">
              Total
            </Typography>
            <Typography
              className="text-blue-700 text-lg font-semibold"
              variant="headline-3-semibold"
            >
              {totalTasks}
            </Typography>
          </div>
          <div className="text-center">
            <Typography className="text-green-600 text-xs" variant="body-m-regular">
              Completed
            </Typography>
            <Typography
              className="text-green-700 text-lg font-semibold"
              variant="headline-3-semibold"
            >
              {completedTasks}
            </Typography>
          </div>
          <div className="text-center">
            <Typography className="text-yellow-600 text-xs" variant="body-m-regular">
              In Progress
            </Typography>
            <Typography
              className="text-yellow-700 text-lg font-semibold"
              variant="headline-3-semibold"
            >
              {inProgressTasks}
            </Typography>
          </div>
        </div>

        {sortedTasks.length === 0 ? (
          <Typography className="text-gray-600" variant="body-lg-regular">
            No tasks in this list yet
          </Typography>
        ) : (
          <div className={`${sortedTasks.length > 10 ? "max-h-[300px] overflow-y-auto" : ""} pr-2`}>
            <ol className="list-none space-y-2">
              {sortedTasks.map((task, index) => (
                <li className="flex items-center gap-2" key={task.id}>
                  <span className="text-gray-500 min-w-[24px]">{index + 1}.</span>
                  <Typography
                    className={`text-gray-800 flex-1 ${task.done ? "line-through text-gray-500" : ""}`}
                    variant="body-lg-regular"
                  >
                    {task.title}
                  </Typography>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </Modal>
  );
}
