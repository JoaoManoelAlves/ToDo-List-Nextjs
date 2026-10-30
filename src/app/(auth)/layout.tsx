import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (userId) redirect("/tasklist");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {children}
    </main>
  );
}