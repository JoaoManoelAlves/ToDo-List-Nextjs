import { TaskContainer } from "@/components/task-container/task-container";
import { ensureUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";

export default async function TaskListPage() {
    const user = await ensureUser();

    const tasks = user ? await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, description: true },
    }): [];

    return (
        <div className="mx-auto max-w-2xl p-4">
            <TaskContainer tasks={tasks} />
        </div>
  );
}