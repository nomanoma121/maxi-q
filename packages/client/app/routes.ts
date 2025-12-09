import {
	index,
	layout,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	route("login", "routes/login.tsx"),
	route("register", "routes/register.tsx"),

	layout("routes/layout.tsx", [
		route("post/question", "routes/post-question.tsx"),
		route("post", "routes/post.tsx"),
		route("timeline", "routes/timeline.tsx"),

		...prefix("users", [
			route("me/posts", "routes/users/me/posts.tsx"),
			route(":id/answers", "routes/users/:id/answers.tsx"),
		]),

		route("question/:id", "routes/question/index.tsx"),
	]),

	index("routes/home.tsx"),
] satisfies RouteConfig;
