import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	route("api/auth/*", "routes/api/auth.ts"),
	route("api/trpc/*", "routes/api/trpc.ts"),
	route("api/set-theme", "routes/api/set-theme.ts"),
	layout("routes/_auth/layout.tsx", [
		route("login", "routes/_auth/login.tsx"),
		route("signup", "routes/_auth/signup.tsx"),
		route("forgot-password", "routes/_auth/forgot-password.tsx"),
		route("verify-email", "routes/_auth/verify-email.tsx"),
		route("reset-password", "routes/_auth/reset-password.tsx"),
	]),
	...prefix("owner", [
		layout("routes/_owner/layout.tsx", [
			index("routes/_owner/index.tsx"),
			// route("dashboard", "routes/_owner/dashboard.tsx"),
			// route("settings", "routes/_owner/settings.tsx"),
		]),
	]),
	...prefix("provider", [
		layout("routes/_provider/layout.tsx", [
			index("routes/_provider/index.tsx"),
			// route("dashboard", "routes/_provider/dashboard.tsx"),
			// route("settings", "routes/_provider/settings.tsx"),
		]),
	]),
	...prefix("seeker", [
		layout("routes/_seeker/layout.tsx", [
			index("routes/_seeker/index.tsx"),
			// route("dashboard", "routes/_seeker/dashboard.tsx"),
			// route("settings", "routes/_seeker/settings.tsx"),
		]),
	]),
	index("routes/_others/index.ts"),
	route("welcome", "routes/_others/welcome.tsx"),
	route("profile", "routes/_others/profile.tsx"),
] satisfies RouteConfig;
