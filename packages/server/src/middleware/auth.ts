import { createFactory } from "hono/factory";
import { jwt } from "hono/jwt";
import type { HonoEnv } from "../index";

const factory = createFactory<HonoEnv>();

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  return jwt({
    secret: c.env.JWT_SECRET,
  })(c, next);
});
