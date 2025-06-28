import { Link } from "react-router";
import { OnboardingDialog } from "~/components/onboarding";
import { buttonVariants } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { ownerOnboardingSlides } from "~/lib/constants";
import type { Route } from "./+types";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const authz = await auth.api.getSession({ headers: request.headers });
	return {
		isOnboarded: authz?.user.onboarded ?? false,
		name: authz?.user.name ?? "",
	};
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { isOnboarded, name } = loaderData;
	return (
		<>
			<div className="flex flex-col">
				<h3 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em]">
					Welcome back, {name.split(" ")[0]}
				</h3>
			</div>
			<OnboardingDialog open={!isOnboarded} slides={ownerOnboardingSlides} />
		</>
	);
}
