import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";

export const users = table("users", {
	id: t.text().primaryKey(),
	displayId: t.text("display_id").notNull(),
	name: t.text("name").notNull(),
	email: t.text().notNull(),
	passwordHash: t.text("password_hash").notNull(),
	createdAt: t.integer("created_at", { mode: "timestamp" }).notNull(),
});

export const question = table("question", {
  postId: t.integer("post_id").primaryKey({ autoIncrement: true }),
  content: t.text("content").notNull(),
  createdAt: t.text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: t.text("updated_at").default("CURRENT_TIMESTAMP"),
  solved: t.integer("solved").default(0),
});