import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../utils/env.js";
import * as schema from "./schema.js";

const { Pool } = pg;

export const hasDatabase = Boolean(env.databaseUrl);

export const pool = hasDatabase
  ? new Pool({
      connectionString: env.databaseUrl
    })
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;
