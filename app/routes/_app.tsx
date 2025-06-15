import { redirect } from "react-router";
import { auth } from "~/lib/auth";
import type { Route } from "./+types/_app";

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const authz = await auth.api.getSession({ headers: request.headers });
		if (!authz?.user) {
			throw redirect("/login");
		}
		if (!authz.user.onboarded) {
			throw redirect("/welcome");
		}
	} catch (error) {
		throw redirect("/login");
	}
}
