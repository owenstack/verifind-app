import { OnboardingDialog } from "~/components/onboarding";
import { auth } from "~/lib/auth";
import { serviceProviderOnboardingSlides } from "~/lib/constants";
import type { Route } from "./+types";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const authz = await auth.api.getSession({ headers: request.headers });
	return { isOnboarded: authz?.user.onboarded ?? false };
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { isOnboarded } = loaderData;
	return (
		<>
			<div>
				<div className="w-full max-w-sm">Welcome to Verifind</div>
			</div>
			{!isOnboarded && (
				<OnboardingDialog
					open={!isOnboarded}
					slides={serviceProviderOnboardingSlides}
				/>
			)}
		</>
	);
}
