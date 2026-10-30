import { z } from "zod";

const email = z.object({email: z.email()})
const name = z.object({name: z.string({error: "Nome é obrigatório"}).trim().min(1, "Deve ter um nome").max(255, "O nome é muito grande")})

export const createUserSchema = z.object({
    name,
    email
})