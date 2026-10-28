import { z } from "zod"

const title = z
  .string()
  .trim()
  .min(1, "O título é obrigatório")
  .max(100, "O título deve ter no máximo 100 caracteres")

const description = z
  .string()
  .trim()
  .max(500, "A descrição deve ter no máximo 500 caracteres")

export const createTaskSchema = z.object({
  title,
  description: description.optional(),
})

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie ao menos um campo para atualizar",
  })