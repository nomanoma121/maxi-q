import { vValidator } from "@hono/valibot-validator";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
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
	password: v.string(),
});

app.use("*", cors());

app.get("/", (c) => c.text("Hono!"));

app.get("/users", async (c) => {
	const db = drizzle(c.env.DB);
	const users = await db
		.select({
			id: usersTable.id,
			displayId: usersTable.displayId,
			name: usersTable.name,
			createdAt: usersTable.createdAt,
		})
		.from(usersTable)
		.all();
	return c.json(users);
});

app.get("/users/:id", async (c) => {
	const { id } = c.req.param();
	const db = drizzle(c.env.DB);

	try {
		const user = await db
			.select({
				id: usersTable.id,
				displayId: usersTable.displayId,
				name: usersTable.name,
				createdAt: usersTable.createdAt,
			})
			.from(usersTable)
			.where(eq(usersTable.id, id))
			.get();
		return c.json(user);
	} catch (e) {
		console.error(e);
		return c.json({ error: "User not found" }, 404);
	}
});

app.post("/api/register", vValidator("json", createUserSchema), async (c) => {
	const { displayId, name, email, password } = c.req.valid("json");
	const db = drizzle(c.env.DB);

	// TODO: passwordのハッシュ化を行う
	try {
		const hashedPassword = await hash(password, 10);

		const result = await db
			.insert(usersTable)
			.values({
				id: crypto.randomUUID(),
				displayId,
				name,
				email,
				passwordHash: hashedPassword,
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
