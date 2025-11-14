import { vValidator } from "@hono/valibot-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import * as v from "valibot";
import { users as usersTable } from "./db/schema";

export interface Env {
	DB: D1Database;
}

export const app = new Hono<{ Bindings: Env }>({});

const createUserSchema = v.object({
	displayId: v.string(),
	name: v.string(),
	email: v.pipe(v.string(), v.email()),
	passwordHash: v.string(),
});

app.get("/", (c) => c.text("Hono!"));

app.get("/users", async (c) => {
	const db = drizzle(c.env.DB);
	const users = await db.select().from(usersTable).all();
	return c.json(users);
});

app.get("/users/:id", async (c) => {
	const { id } = c.req.param();
	const db = drizzle(c.env.DB);

	try {
		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id))
			.get();
		return c.json(user);
	} catch (e) {
		console.error(e);
		return c.json({ error: "User not found" }, 404);
	}
});

app.post("/users", vValidator("json", createUserSchema), async (c) => {
	const { displayId, name, email, passwordHash } = c.req.valid("json");
	const db = drizzle(c.env.DB);

	try {
		const result = await db
			.insert(usersTable)
			.values({
				id: crypto.randomUUID(),
				displayId,
				name,
				email,
				passwordHash,
				createdAt: new Date(),
			})
			.returning();
		return c.json(result);
	} catch (e) {
		console.error(e);
		return c.json({ error: "Failed to create user" }, 500);
	}
});

export default { fetch: app.fetch };
