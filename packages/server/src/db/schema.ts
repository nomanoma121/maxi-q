import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const users = table(
  "users",
  {
    id: t.text().primaryKey(),
    name: t.text("name"),
    email: t.text().notNull(),
    passwordHash: t.text("password_hash").notNull(),
    createdAt: t.integer("created_at", { mode: "timestamp" }).notNull(),
  },
);
