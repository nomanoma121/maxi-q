import {
	index,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	route("login", "routes/login.tsx"),
	route("register", "routes/register.tsx"),
	...prefix("users", [
		route("me/posts", "routes/users/me/posts.tsx"),
		route(":id/answers", "routes/users/:id/answers.tsx"),
	]),
	...prefix("posts", [
		route(":id", "routes/posts/:id.tsx"),
		route(":id/answer", "routes/posts/:id/answer.tsx"),
	]),
	route("post", "routes/post.tsx"),
	route("timeline", "routes/timeline.tsx"),
	index("routes/home.tsx"),
] satisfies RouteConfig;
