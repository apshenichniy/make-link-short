import "server-only";

import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "./db";
import { shortLinks, users as usersTable } from "./db/schema";
import { redis } from "./redis";

export const getCachedStats = async () => {
  // fetch from cache
  const [users, links, visits] = await Promise.all([
    redis.get<number>("stat:users"),
    redis.get<number>("stat:links"),
    redis.get<number>("stat:visits"),
  ]);

  if (users === null) {
    // fetch from db
    const stat = await fetchStats();
    // cache stat
    await Promise.all([
      redis.set("stat:users", stat.users),
      redis.set("stat:links", stat.links),
      redis.set("stat:visits", stat.visits),
    ]);
    return stat;
  }

  return { users, links, visits };
};

export const purgeStatsCache = () =>
  redis.del("stat:users", "stat:links", "stat:visits");

export const fetchStats = async () => {
  const users = (await db.select().from(usersTable)).length;
  const links = await db.select().from(shortLinks);
  const visits = links.reduce((acc, link) => acc + link.visits, 0);

  return { users, links: links.length, visits };
};

export const incrementUsers = async (count: number = 1) => {
  redis.incrby("stat:users", count);
};

export const getShortlinks = async () => {
  const session = await auth();
  if (!session?.user) throw new Error("Session not found");

  return db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.userId, session.user.id));
};
