import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { buttonVariants } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-white px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">TaskUp</h1>
        <p className="text-xl text-muted-foreground">
          Suas atividades em dia.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {userId ? (
          <Link href="/tasklist" className={buttonVariants({ size: "lg" })}>
            Ir para minhas atividades
          </Link>
        ) : (
          <>
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Criar conta
            </Link>
            <Link
              href="/signin"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Entrar
            </Link>
          </>
        )}
      </div>
    </main>
  );
}