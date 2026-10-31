"use client";

import { useCallback, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { setTaskCompleted } from "@/components/actions/task";
import { TaskInputForm, type EditableTask } from "@/components/task-input/task-input-form";

export function TaskContainer({ tasks }: { tasks: EditableTask[] }) {
  const [editingTask, setEditingTask] = useState<EditableTask | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSaved = useCallback(() => setEditingTask(null), []);

  function handleToggle(task: EditableTask) {
    // se a tarefa estiver aberta para edição, fecha o formulário antes de concluir
    if (editingTask?.id === task.id) setEditingTask(null);

    startTransition(async () => {
      await setTaskCompleted(task.id, !task.completed);
    });
  }

  return (
    <div className="w-full space-y-8">
      {/* key força a remontagem do formulário ao trocar de modo */}
      <TaskInputForm
        key={editingTask?.id ?? "new"}
        task={editingTask ?? undefined}
        onSaved={handleSaved}
      />

      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma atividade cadastrada.</p>
      ) : (
        <ul className="flex w-full flex-col gap-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex w-full items-start justify-between gap-6 rounded-md border-[3px] border-solid border-black bg-gray-200 p-5 ${
                task.completed ? "opacity-70" : ""
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium ${task.completed ? "line-through" : ""}`}
                  >
                    {task.title}
                  </label>
                  {task.completed && (
                    <span className="text-sm font-semibold text-green-600">
                      Concluído
                    </span>
                  )}
                </div>

                {task.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTask(task)}
                  disabled={task.completed || isPending}
                >
                  Alterar
                </Button>

                <Checkbox
                  className="border-2 border-black"
                  id={`task-${task.id}`}
                  checked={task.completed}
                  disabled={isPending}
                  onCheckedChange={() => handleToggle(task)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}