import { vValidator } from "@hono/valibot-validator";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import * as v from "valibot";
import {
	answers as answersTable,
	questions as questionsTable,
	users as usersTable,
} from "./db/schema";

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

app.get("/questions/:id", async (c) => {
	const { id } = c.req.param();
	const db = drizzle(c.env.DB);

	try {
		const question = await db
			.select()
			.from(questionsTable)
			.where(eq(questionsTable.id, id))
			.get();

		if (!question) {
			return c.json({ error: "Question not found" }, 404);
		}

		return c.json(question, 200);
	} catch (e) {
		console.error(e);
		return c.json({ error: "Failed to fetch question" }, 500);
	}
});

app.get("/questions/:id/answers", async (c) => {
	const { id: questionId } = c.req.param();
	const db = drizzle(c.env.DB);

	try {
		// 回答一覧取得
		const answers = await db
			.select()
			.from(answersTable)
			.where(eq(answersTable.questionId, questionId))
			.all();

		return c.json(answers, 200);
	} catch (e) {
		console.error(e);
		return c.json({ error: "Failed to fetch answers" }, 500);
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
