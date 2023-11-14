import { env } from "@/env.mjs";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

const queryClient = neon(env.POSTGRES_URL);
export const db = drizzle(queryClient);
