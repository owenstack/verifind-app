import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { auth } from "~/lib/auth";
import { useDraftList } from "~/lib/draft/hooks";
import { useTRPC } from "~/trpc/client";
import { PropertyCard } from "../../components/owner/property-card";
import type { Route } from "./+types/listings";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const authz = await auth.api.getSession({ headers: request.headers });
	return {
		userId: authz?.user.id ?? "",
	};
};

type PropertyStatus = "all" | "active" | "pending" | "draft" | "inactive";

export default function Page({ loaderData }: Route.ComponentProps) {
	const { userId } = loaderData;
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("recent");
	const trpc = useTRPC();
	const { data, isLoading, error } = useQuery(
		trpc.property.getOwnerProperties.queryOptions(),
	);
	if (error || data?.error) {
		toast.error("Something went wrong", {
			description:
				error?.message || data?.error || "Unable to load properties.",
		});
	}
	// Load drafts first (local storage)
	const { drafts } = useDraftList(userId);
	const _stats = {
		totalViews: 0,
		totalFavorites: 0,
		activeListings: 0,
		draftListings: drafts.length,
	};

	const filterItems = (status: PropertyStatus) => {
		const filteredDrafts = drafts.filter((draft) => {
			if (status !== "all" && status !== "draft") return false;
			if (!searchQuery) return true;
			const searchLower = searchQuery.toLowerCase();
			return (
				draft.data.title?.toLowerCase().includes(searchLower) ||
				draft.data.area?.toLowerCase().includes(searchLower)
			);
		});

		const filteredProperties = data?.data?.filter((property) => {
			if (status !== "all" && property.status !== status) return false;
			if (!searchQuery) return true;
			const searchLower = searchQuery.toLowerCase();
			return (
				property.title?.toLowerCase().includes(searchLower) ||
				property.area?.toLowerCase().includes(searchLower)
			);
		});

		return [
			...filteredDrafts.map((draft) => ({
				type: "draft" as const,
				data: draft,
			})),
			...(filteredProperties?.map((property) => ({
				type: "property" as const,
				data: property,
			})) ?? []),
		];
	};

	return (
		<div className="flex flex-col w-full">
			{/* Tabs with Properties List */}
			<Tabs defaultValue="all">
				<TabsList className="w-full">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="active">Active</TabsTrigger>
					<TabsTrigger value="pending">Pending</TabsTrigger>
					<TabsTrigger value="draft">Drafts</TabsTrigger>
					<TabsTrigger value="inactive">Inactive</TabsTrigger>
				</TabsList>

				<div className="p-4 space-y-3">
					<div className="relative">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
						<Input
							placeholder="Search listings"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-12 bg-muted border-0 h-12"
						/>
					</div>
					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="h-14">
							<SelectValue placeholder="Sort" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recent">Most Recent</SelectItem>
							<SelectItem value="oldest">Oldest First</SelectItem>
							<SelectItem value="views">Most Viewed</SelectItem>
							<SelectItem value="price_high">Price: High to Low</SelectItem>
							<SelectItem value="price_low">Price: Low to High</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{(
					["all", "active", "pending", "draft", "inactive"] as PropertyStatus[]
				).map((status) => {
					const items = filterItems(status);
					return (
						<TabsContent key={status} value={status} className="mt-0">
							<div className="pb-20">
								{isLoading && items.length === 0 ? (
									<div className="p-4 text-center text-muted-foreground">
										Loading properties...
									</div>
								) : items.length === 0 ? (
									<div className="p-4 text-center space-y-4">
										<p className="text-muted-foreground">No properties found</p>
										<Link to="/owner/listings/new" className={buttonVariants()}>
											<Plus className="h-4 w-4 mr-2" />
											Create Your First Listing
										</Link>
									</div>
								) : (
									items.map((item, _index) => (
										<PropertyCard
											key={
												item.type === "draft"
													? `draft-${item.data.id}`
													: `property-${item.data.id}`
											}
											type={item.type}
											data={item.data}
										/>
									))
								)}
							</div>
						</TabsContent>
					);
				})}
			</Tabs>
		</div>
	);
}
