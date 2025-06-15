import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
	route("api/auth/*", "routes/api/auth.$.ts"),
	route("login", "routes/_auth/login.tsx"),
	route("signup", "routes/_auth/signup.tsx"),
	route("api/trpc/*", "routes/api/trpc.$.ts"),
	route("api/set-theme", "routes/api/set-theme.ts"),
	...(await flatRoutes({})),
] satisfies RouteConfig;
