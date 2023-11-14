import { type Config } from "drizzle-kit"

import { env } from "./env.mjs"

export default {
  schema: "./lib/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
} satisfies Config
