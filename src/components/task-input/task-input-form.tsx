"use client";

import { useActionState, useEffect } from "react";
import { createTask, updateTask, type TaskFormState } from "@/components/actions/task";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type EditableTask = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
};

type TaskInputFormProps = {
  task?: EditableTask;
  onSaved?: () => void;
};

const initialState: TaskFormState = {};

export function TaskInputForm({ task, onSaved }: TaskInputFormProps) {
  const [state, formAction, isPending] = useActionState(
    task ? updateTask : createTask,
    initialState
  );

  useEffect(() => {
    if (state.success) onSaved?.();
  }, [state.success, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={task?.id ?? ""} />

      <div className="space-y-2">
        <Label htmlFor="input-task">Título</Label>
        <Input
          id="input-task"
          name="title"
          placeholder="Fazer..."
          defaultValue={state.values?.title ?? task?.title ?? ""}
          aria-invalid={!!state.errors?.title}
        />
        {state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description-task">Descrição (opcional)</Label>
        <Textarea
          id="description-task"
          name="description"
          placeholder="Como fazer..."
          defaultValue={state.values?.description ?? task?.description ?? ""}
          aria-invalid={!!state.errors?.description}
        />
        {state.errors?.description && (
          <p className="text-sm text-destructive">{state.errors.description[0]}</p>
        )}
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Salvando..."
          : task
            ? "Salvar alterações"
            : "Cadastrar tarefa"}
      </Button>
    </form>
  );
}