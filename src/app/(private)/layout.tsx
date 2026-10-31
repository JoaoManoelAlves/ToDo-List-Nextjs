// app/(private)/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/ensure-user";

export default async function PrivateLayout({children}: Readonly<{children: React.ReactNode}>) {
  const { userId } = await auth();
  if (!userId) redirect("/signin");

  await ensureUser();

  return <>{children}</>;
}