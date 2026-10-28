import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { createTaskSchema, updateTaskSchema} from "@/lib/validations/task"

export async function GET() {
    const {userId} = await auth()
    if(!userId){
        return NextResponse.json({
            "status": 401,
            "message": "Unauthorized"
        })
    }
    try {
        const tasks = await prisma.task.findMany({
            where: { userId }, // só as tarefas do usuário logado
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json({ data: tasks })
    } catch (error) {
         console.error(error)
        return NextResponse.json({ message: "Erro ao listar tarefas" }, { status: 500 })
    }
}

