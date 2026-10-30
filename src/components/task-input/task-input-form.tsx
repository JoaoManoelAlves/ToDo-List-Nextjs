"use client";

import { useActionState } from "react";
import { createTask, type TaskFormState } from "../actions/task";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const initialState: TaskFormState = {};

export function TaskForm() {
  const [state, formAction, isPending] = useActionState(createTask, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input-task">Título</Label>
        <Input
          id="input-task"
          name="title"
          placeholder="Fazer..."
          defaultValue={state.values?.title ?? ""}
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
          defaultValue={state.values?.description ?? ""}
          aria-invalid={!!state.errors?.description}
        />
        {state.errors?.description && (
          <p className="text-sm text-destructive">{state.errors.description[0]}</p>
        )}
      </div>

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Cadastrar tarefa"}
      </Button>
    </form>
  );
}