"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations/task";

export type TaskFormState = {
  message?: string;
  errors?: { title?: string[]; description?: string[] };
  values?: { title: string; description: string };
};

export async function createTask(
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { message: "Deve estar logado" };
    }

    const rawValues = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    const validateTask = createTaskSchema.safeParse(rawValues);

    if (!validateTask.success) {
      return {
        errors: validateTask.error.flatten().fieldErrors,
        values: rawValues,
      };
    }

    await prisma.task.create({
      data: { ...validateTask.data, userId },
    });

    revalidatePath("/tasks");
    return { message: "Atividade/Task criada com sucesso" };
  } catch (error) {
    console.error("Erro ao criar task:", error);
    return { message: "Não foi possível criar a tarefa." };
  }
}