// lib/ensure-user.ts
import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function ensureUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await prisma.user.findUnique({
    where: { id: clerkUser.id },
  });
  if (existing) return existing;

  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email;

  return prisma.user.create({
    data: { id: clerkUser.id, email, name },
  });
}