import { TaskContainer } from "@/components/task-container/task-container";
import { ensureUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";

export default async function TaskListPage() {
  const user = await ensureUser();

  const tasks = user
    ? await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, description: true, completed: true },
      })
    : [];

  return (
    <div className="mx-auto w-120 p-4 flex flex-col justify-between items-center">
        <h1>TaskUp - Suas Atividades em Dia</h1>
        <TaskContainer tasks={tasks} />
    </div>
  );
}