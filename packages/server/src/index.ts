import { vValidator } from "@hono/valibot-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign } from "hono/jwt"; // JWT用の関数をインポート
import { verify } from "hono/jwt";// 認証ミドルウェア用の関数をインポート
import { authMiddleware } from "./middlewares/auth"; //追加
import * as v from "valibot";
import { questions as questionsTable, users as usersTable } from "./db/schema";

export interface Env {
  DB: D1Database;
  JWT_SECRET: string; // 環境変数にJWTシークレットを追加
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const app = new Hono<{ Bindings: Env }>({});

const createUserSchema = v.object({
	displayId: v.string(),
	name: v.string(),
	email: v.pipe(v.string(), v.email()),
	password: v.string(),
});

const loginUserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

const createQuestionSchema = v.object({
	title: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
	content: v.pipe(v.string(), v.minLength(1), v.maxLength(5000)),
});

app.use("*", cors());

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

// ユーザー登録（ハッシュ化対応済み）
app.post("/users", vValidator("json", createUserSchema), async (c) => {
	const { displayId, name, email, password } = c.req.valid("json");
	const db = drizzle(c.env.DB);

	// TODO: passwordのハッシュ化を行う

	try {
    const passwordHash = await hashPassword(password);
		
    const result = await db
			.insert(usersTable)
			.values({
				id: crypto.randomUUID(),
				displayId,
				name,
				email,
				passwordHash: passwordHash,
				createdAt: new Date(),
			})
			.returning();
		return c.json(result);
	} catch (e) {
		console.error(e);
		return c.json({ error: "Failed to create user" }, 500);
	}
});

// ログインAPI（新規追加）
app.post("/login", vValidator("json", loginUserSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const db = drizzle(c.env.DB);

  try {
    // メールアドレスでユーザーを検索
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // パスワードの照合（入力されたパスワードをハッシュ化して比較）
    const inputHash = await hashPassword(password);
    
    if (user.passwordHash !== inputHash) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // JWTペイロードの作成
    const payload = {
      sub: user.id,
      name: user.name,
      displayId: user.displayId,
      // トークンの有効期限 (例: 24時間後)
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, 
    };

    // シークレットキーの取得確認
    if (!c.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return c.json({ error: "Internal Server Error" }, 500);
    }

    // トークンの発行
    const token = await sign(payload, c.env.JWT_SECRET);

    return c.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        displayId: user.displayId,
        email: user.email
      }
    });

  } catch (e) {
    console.error(e);
    return c.json({ error: "Login failed" }, 500);
  }
});

// JWT 認証を /questions に適用
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

export default { fetch: app.fetch };
