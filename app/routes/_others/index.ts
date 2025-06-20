import { redirect } from "react-router";
import { auth } from "~/lib/auth";
import type { Route } from "./+types";

export async function loader({ request }: Route.LoaderArgs) {
	const authz = await auth.api.getSession({ headers: request.headers });
	if (!authz) {
		return redirect("/login");
	}
	if (!authz?.user.emailVerified) {
		return redirect("/verify-email");
	}
	if (!authz.user.onboarded) {
		return redirect("/welcome");
	}

	return redirect(`/${authz?.user.mode}`);
}
