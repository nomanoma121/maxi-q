import { app } from "../index"

app.get("/user", async (c) => {
  return c.text("User route is working!");
});

app.post("/user", async (c) => {
  const req = await c.req.json();
  return c.json({ message: "User created", user: req });
});
