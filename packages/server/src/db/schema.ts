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
