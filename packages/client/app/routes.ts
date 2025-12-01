import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/post/questions", "routes/post-question.tsx"),
] satisfies RouteConfig;
