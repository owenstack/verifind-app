import type { Route } from "./+types";
import { auth } from "~/lib/auth";
import { useState } from "react";
import { updateUser } from "~/lib/auth.client";
import { OnboardingDialog } from "~/components/onboarding";
import { seekerOnboardingSlides } from "~/lib/constants";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const authz = await auth.api.getSession({ headers: request.headers });
	return { isOnboarded: authz?.user.onboarded ?? false };
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { isOnboarded } = loaderData;
	return (
		<>
			<div>
				<h1 className="text-2xl font-bold">Seeker Dashboard</h1>
				<p className="mt-4">Welcome to the seeker dashboard!</p>
				{/* Add more content or components as needed */}
			</div>
			<OnboardingDialog open={!isOnboarded} slides={seekerOnboardingSlides} />
		</>
	);
}
