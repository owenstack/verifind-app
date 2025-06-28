import { OnboardingDialog } from "~/components/onboarding";
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
	const hours = new Date().getHours();
	const greeting =
		hours < 12
			? "Good morning"
			: hours < 18
				? "Good afternoon"
				: "Good evening";
	return (
		<>
			<div>
				<p>
					{greeting}, {name.split(" ")[0]}!
				</p>
				Owner dashboard
			</div>
			<OnboardingDialog open={!isOnboarded} slides={ownerOnboardingSlides} />
		</>
	);
}
