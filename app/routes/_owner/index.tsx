import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { OnboardingDialog } from "~/components/onboarding";
import {
	ActiveInquiries,
	ActiveListings,
	BestPerforming,
	OccupancyRate,
	RecentActivity,
	TotalViews,
} from "~/components/owner/insights";
import { Skeleton } from "~/components/ui/skeleton";
import { auth } from "~/lib/auth";
import { ownerOnboardingSlides } from "~/lib/constants";
import { useTRPC } from "~/trpc/client";
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
	const now = new Date().getHours();
	const greeting =
		now < 12 ? "Good morning" : now < 18 ? "Good afternoon" : "Good evening";
	const trpc = useTRPC();
	const { data, isLoading, error } = useQuery(
		trpc.property.getOwnerOverview.queryOptions(),
	);

	if (error || data?.error) {
		toast.error("Something went wrong", {
			description: error?.message || data?.error || "Unable to load overview.",
		});
	}

	return (
		<>
			<div className="flex flex-col">
				<h3 className="px-4 pb-4 text-lg font-semibold leading-tight tracking-[-0.015em]">
					{greeting}, {name.split(" ")[0]}
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{isLoading ? (
						<>
							<Skeleton className="h-24" />
							<Skeleton className="h-24" />
							<Skeleton className="h-24" />
							<Skeleton className="h-24" />
						</>
					) : (
						<>
							<ActiveListings number={data?.data?.activeListings ?? 0} />
							<ActiveInquiries number={data?.data?.activeInquiries ?? 0} />
							<OccupancyRate rate={data?.data?.occupancyRate ?? 0} />
							<TotalViews views={data?.data?.totalViews ?? 0} />
						</>
					)}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
					<div className="flex flex-col">
						<h4 className="font-semibold py-4 text-base">
							Top performing properties
						</h4>
						{isLoading ? (
							<Skeleton className="h-72" />
						) : (
							<BestPerforming properties={data?.data?.bestPerforming} />
						)}
					</div>
					<div className="flex flex-col">
						<h4 className="font-semibold py-4 text-base">Recent activity</h4>
						{isLoading ? (
							<Skeleton className="h-72" />
						) : (
							<RecentActivity activities={data?.data?.recentActivity} />
						)}
					</div>
				</div>
			</div>
			{/* Onboarding dialog */}
			{!isOnboarded && (
				<OnboardingDialog open={!isOnboarded} slides={ownerOnboardingSlides} />
			)}
		</>
	);
}
