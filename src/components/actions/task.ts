"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/ensure-user";
import { createTaskSchema } from "@/lib/validations/task";

export type TaskFormState = {
  message?: string;
  success?: boolean;
  errors?: { title?: string[]; description?: string[] };
  values?: { title: string; description: string };
};

function readTaskForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

export async function createTask(_prevState: TaskFormState,formData: FormData): Promise<TaskFormState> {
  try {
    const user = await ensureUser();
    if (!user) return { message: "Deve estar logado" };

    const rawValues = readTaskForm(formData);
    const validateTask = createTaskSchema.safeParse(rawValues);
    if (!validateTask.success) {
      return {
        errors: validateTask.error.flatten().fieldErrors,
        values: rawValues,
      };
    }

    await prisma.task.create({
      data: { ...validateTask.data, userId: user.id },
    });

    revalidatePath("/tasklist");
    return { success: true, message: "Atividade criada com sucesso" };
  } catch (error) {
    console.error("Erro ao criar task:", error);
    return { message: "Não foi possível criar a tarefa." };
  }
}

export async function updateTask(_prevState: TaskFormState, formData: FormData): Promise<TaskFormState> {
  try {
    const user = await ensureUser();
    if (!user) return { message: "Deve estar logado" };

    const id = String(formData.get("id") ?? "");
    const rawValues = readTaskForm(formData);
    const validateTask = createTaskSchema.safeParse(rawValues);
    if (!validateTask.success) {
      return {
        errors: validateTask.error.flatten().fieldErrors,
        values: rawValues,
      };
    }

    // userId impede editar tarefas de outro usuário
    // completed: false impede editar tarefas já concluídas
    const result = await prisma.task.updateMany({
      where: { id, userId: user.id, completed: false },
      data: {
        title: validateTask.data.title,
        description: validateTask.data.description ?? null,
      },
    });

    if (result.count === 0) {
      return { message: "Atividade não encontrada ou já concluída" };
    }

    revalidatePath("/tasklist");
    return { success: true, message: "Atividade atualizada com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar task:", error);
    return { message: "Não foi possível atualizar a tarefa." };
  }
}

export async function setTaskCompleted(id: string, completed: boolean): Promise<{ message?: string }> {
  try {
    const user = await ensureUser();
    if (!user) return { message: "Deve estar logado" };

    const result = await prisma.task.updateMany({
      where: { id, userId: user.id },
      data: { completed },
    });

    if (result.count === 0) {
      return { message: "Atividade não encontrada" };
    }

    revalidatePath("/tasklist");
    return {};
  } catch (error) {
	  console.error("Erro ao concluir task:", error);
    return { message: "Não foi possível atualizar a tarefa." };
  }
}

export async function deleteTask(id: string): Promise<{ message?: string }> {
  try {
    const user = await ensureUser();
    if (!user) return { message: "Deve estar logado" };

    const result = await prisma.task.deleteMany({
      where: { id, userId: user.id },
    });

    if (result.count === 0) {
      return { message: "Atividade não encontrada" };
    }

    revalidatePath("/tasklist");
    return {};
  } catch (error) {
    console.error("Erro ao excluir task:", error);
    return { message: "Não foi possível excluir a tarefa." };
  }
}
