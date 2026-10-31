"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskInputForm, type EditableTask } from "@/components/task-input/task-input-form";

export function TaskContainer({ tasks }: { tasks: EditableTask[] }) {
  const [editingTask, setEditingTask] = useState<EditableTask | null>(null);

  const handleSaved = useCallback(() => setEditingTask(null), []);

  return (
    <div className="w-full space-y-8">
      {/* key força a remontagem do formulário ao trocar de modo,
          limpando os campos e carregando a tarefa escolhida */}
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
              className="flex w-90 items-start justify-between gap-6 rounded-md border-[3px] border-solid border-black bg-gray-200 p-5"
            >
              <div>
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingTask(task)}
              >
                Alterar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}