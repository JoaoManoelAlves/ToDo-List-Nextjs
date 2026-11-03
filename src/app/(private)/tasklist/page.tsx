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
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">TaskUp</h1>
          <p className="text-lg text-muted-foreground">
            Suas atividades em dia
          </p>
        </header>

        <section className="rounded-xl border-[3px] border-solid border-black p-6">
          <TaskContainer tasks={tasks} />
        </section>
      </div>
    </main>
  );
}