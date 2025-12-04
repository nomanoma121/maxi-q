import type { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
	const auth = c.req.header("Authorization");

	if (!auth || !auth.startsWith("Bearer ")) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const token = auth.replace("Bearer ", "");

	try {
		const payload = await verify(token, c.env.JWT_SECRET);

		c.set("userId", payload.sub);
		await next();
	} catch (err) {
		console.error("JWT verify error:", err);
		return c.json({ error: "Invalid or expired token" }, 401);
	}
};
