import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/postQues", "routes/postQues.tsx"),
] satisfies RouteConfig;

