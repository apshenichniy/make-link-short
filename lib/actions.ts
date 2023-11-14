"use server";

import { auth, signIn } from "@/lib/auth";

import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getCachedStats } from "./data";
import { db } from "./db";
import { shortLinks } from "./db/schema";
import { redis } from "./redis";

export const signInAndSaveLink = async (linkId: string) => {
  await signIn("github", { redirectTo: `/api/auth/save-link?link=${linkId}` });
};

export const getStats = async () => {
  return getCachedStats();
};

export const createShortLink = async (data: typeof shortLinks.$inferInsert) => {
  const session = await auth();
  // hash password
  const password = data.password ? await hash(data.password, 10) : undefined;

  await db
    .insert(shortLinks)
    .values({
      ...data,
      userId: session?.user.id,
      password,
    })
    .onConflictDoNothing();

  // increment stat
  await redis.incr("stat:links");

  revalidatePath("/");
};

export const getShortlinks = async () => {
  const session = await auth();
  if (!session?.user) throw new Error("Session not founr");

  return db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.userId, session.user.id));
};

export const updateShortlinkUser = async (linkId: string, userId: string) => {
  await db
    .update(shortLinks)
    .set({ userId: userId, updatedAt: new Date() })
    .where(eq(shortLinks.id, linkId));
};

export const findShortlink = async (linkId: string) => {
  return db.select().from(shortLinks).where(eq(shortLinks.id, linkId));
};

export const visitShortlink = async (linkId: string) => {
  const res = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.id, linkId));

  if (res.length === 0) {
    notFound();
  }

  const { url, visits } = res[0];
  await db
    .update(shortLinks)
    .set({ visits: visits + 1, lastVisit: new Date() })
    .where(eq(shortLinks.id, linkId));

  await redis.incr("stat:visits");
  revalidatePath("/");

  return url;
};
