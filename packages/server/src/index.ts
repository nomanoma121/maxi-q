import { vValidator } from "@hono/valibot-validator";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign } from "hono/jwt";
import * as v from "valibot";
import {
	answers as answersTable,
	questions as questionsTable,
	users as usersTable,
} from "./db/schema";
import { authMiddleware } from "./middlewares/auth";

const EXPIRED_DURATION = 60 * 60 * 48;

export const app = new Hono<{ Bindings: Env }>({});

const registerSchema = v.object({
	displayId: v.string(),
	name: v.string(),
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8)),
});
const loginUserSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8)),
});

const createQuestionSchema = v.object({
	title: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
	content: v.pipe(v.string(), v.minLength(1), v.maxLength(5000)),
});

const createAnswerSchema = v.object({
	content: v.pipe(v.string(), v.minLength(1), v.maxLength(5000)),
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

app.post("/api/register", vValidator("json", registerSchema), async (c) => {
	const { displayId, name, email, password } = c.req.valid("json");
	const db = drizzle(c.env.DB);

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

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

app.post("/login", vValidator("json", loginUserSchema), async (c) => {
	const { email, password } = c.req.valid("json");
	const db = drizzle(c.env.DB);

	try {
		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.get();

		if (!user) {
			return c.json({ error: "Invalid email or password" }, 401);
		}

		const isValid = await bcrypt.compare(password, user.passwordHash);

		if (!isValid) {
			return c.json({ error: "Invalid email or password" }, 401);
		}

		const payload = {
			sub: user.id,
			exp: Math.floor(Date.now() / 1000) + EXPIRED_DURATION,
		};

		if (!c.env.JWT_SECRET) {
			console.error("JWT_SECRET is not set");
			return c.json({ error: "Internal Server Error" }, 500);
		}

		const token = await sign(payload, c.env.JWT_SECRET);

		return c.json({
			token,
		});
	} catch (e) {
		console.error(e);
		return c.json({ error: "Login failed" }, 500);
	}
});

app.use("/questions/*", authMiddleware);

app.post("/questions", vValidator("json", createQuestionSchema), async (c) => {
	const { title, content } = c.req.valid("json");
	const db = drizzle(c.env.DB);

	try {
		const result = await db
			.insert(questionsTable)
			.values({
				id: crypto.randomUUID(),
				title,
				content,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return c.json(result, 201);
	} catch (e) {
		console.error(e);
		return c.json({ error: "Failed to create question" }, 500);
	}
});

app.get("/questions", async (c) => {
	const db = drizzle(c.env.DB);

	try {
		const questions = await db.select().from(questionsTable).all();
		return c.json(questions, 200);
	} catch (e) {
		console.error(e);
		return c.json({ error: "Failed to fetch questions" }, 500);
	}
});

app.post(
	"/questions/:id/answers",
	vValidator("json", createAnswerSchema),
	async (c) => {
		const { id: questionId } = c.req.param();
		const { content } = c.req.valid("json");

		const db = drizzle(c.env.DB);

		const question = await db
			.select()
			.from(questionsTable)
			.where(eq(questionsTable.id, questionId))
			.get();

		if (!question) {
			return c.json({ error: "Question not found" }, 404);
		}

		try {
			const result = await db
				.insert(answersTable)
				.values({
					id: crypto.randomUUID(),
					questionId: questionId,
					content,
					answeredAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();

			return c.json(result, 201);
		} catch (e) {
			console.error(e);
			return c.json({ error: "Failed to post answer" }, 500);
		}
	},
);

export default { fetch: app.fetch };
