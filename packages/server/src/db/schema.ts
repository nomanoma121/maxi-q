import { sql } from "drizzle-orm";
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

export const questions = table("questions", {
	id: t.text("id").primaryKey(),
	title: t.text("title").notNull(),
	content: t.text("content").notNull(),
	createdAt: t
		.integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: t
		.integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	solved: t.integer("solved").notNull().default(0),
});

export const answers = table("answers", {
  answerId: t.text("answer_id").primaryKey(),
  postId: t.text("post_id").notNull(),
  content: t.text("content").notNull(),
  answeredAt: t.integer("answered_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: t.integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

