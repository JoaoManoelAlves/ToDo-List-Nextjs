// components/tasks-container.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function TasksContainer() {
  const { userId } = await auth();
  if (!userId) {
    return <p className="text-sm">Deve estar logado para ver suas atividades</p>;
  }

  const tasks = await prisma.task.findMany({
    where: {userId},
    orderBy: {createdAt: "desc"}
  });

  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma atividade cadastrada.</p>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-md border p-4">
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}