"use server";

import { auth, signIn } from "@/lib/auth";

import { compare, hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { getCachedStats } from "./data";
import { db } from "./db";
import { shortLinks } from "./db/schema";
import { redis } from "./redis";

export type ShortlinkData = typeof shortLinks.$inferSelect;

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
  // find in cache
  const cached = await redis.get<ShortlinkData>(linkId);
  if (cached) return cached;

  const fetched = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.id, linkId));

  if (fetched.length === 0) return undefined;

  // cache it
  await redis.set(linkId, fetched[0]);

  return fetched[0];
};

export const updateShortlinkVisits = async (linkId: string, visits: number) => {
  await db
    .update(shortLinks)
    .set({ visits, lastVisit: new Date() })
    .where(eq(shortLinks.id, linkId));

  await redis.incr("stat:visits");
};

export const processProtectedLink = async (
  password: string,
  shortLink: ShortlinkData
) => {
  if (!shortLink.password) throw new Error("Password not set");
  const isValid = await compare(password, shortLink.password);
  if (!isValid) return { error: "Password is wrong. Try again." };

  updateShortlinkVisits(shortLink.id, shortLink.visits + 1);
  permanentRedirect(shortLink.url);
};
