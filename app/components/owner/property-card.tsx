import { Clock, Eye, Heart } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import type { Property } from "~/db/property.schema";
import type { PropertyDraftData } from "~/lib/draft/types";
import { PropertyMenu } from "./property-menu";

interface PropertyCardProps {
	type: "property" | "draft";
	data: Property | PropertyDraftData;
}

export function PropertyCard({ type, data }: PropertyCardProps) {
	const isDraft = type === "draft";
	const propertyData = isDraft
		? (data as PropertyDraftData).data
		: (data as Property);

	// Get the primary image or fallback
	const primaryImage = isDraft
		? null // Drafts might not have images yet
		: (data as Property & { images?: { url: string; thumbnailUrl: string }[] })
				?.images?.[0];

	const imageUrl = primaryImage?.thumbnailUrl || "/placeholder-property.jpg";

	// Format price
	const formatPrice = (price?: number) => {
		if (!price) return "Price not set";
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: propertyData?.currency || "NGN",
			minimumFractionDigits: 0,
		}).format(price);
	};

	// Get status info
	const getStatusInfo = () => {
		if (isDraft) {
			return {
				label: "Draft",
				variant: "secondary" as const,
				description: "Not published yet",
			};
		}

		const status = (data as Property).status;
		switch (status) {
			case "active":
				return {
					label: "Active",
					variant: "default" as const,
					description: "Available",
				};
			case "pending":
				return {
					label: "Pending",
					variant: "outline" as const,
					description: "Under review",
				};
			case "rented":
				return {
					label: "Rented",
					variant: "default" as const,
					description: "Currently rented",
				};
			case "inactive":
				return {
					label: "outline",
					variant: "secondary" as const,
					description: "Not visible",
				};
			default:
				return {
					label: status,
					variant: "secondary" as const,
					description: "",
				};
		}
	};

	const statusInfo = getStatusInfo();

	return (
		<div className="relative overflow-hidden rounded-lg bg-card shadow-md transition-all hover:shadow-lg">
			<Link
				to={
					isDraft
						? `/owner/listings/${data.id}/edit`
						: `/owner/listings/${data.id}`
				}
				className="block"
			>
				<div
					className="h-40 w-full bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: `url("${imageUrl}")` }}
					aria-label="Property image"
				/>
			</Link>

			<div className="p-4">
				<div className="flex items-start justify-between">
					<div className="flex-1 pr-4">
						<div className="flex items-center gap-2">
							<Badge variant={statusInfo.variant} className="text-xs">
								{statusInfo.label}
							</Badge>
						</div>

						<h3 className="mt-2 line-clamp-2 text-base font-bold text-foreground">
							{propertyData?.title || "Untitled Property"}
						</h3>

						<p className="mt-1 line-clamp-1 text-sm font-normal text-muted-foreground">
							{propertyData?.address ||
								propertyData?.area ||
								"Location not set"}
						</p>
					</div>

					<div className="absolute right-2 top-2">
						<PropertyMenu
							id={
								isDraft ? (data as PropertyDraftData).id : (data as Property).id
							}
						/>
					</div>
				</div>

				<div className="mt-4 flex items-center gap-2 text-sm text-foreground">
					<span className="font-medium">
						{formatPrice(propertyData?.price)}
					</span>
					{propertyData?.rentType && (
						<span className="text-muted-foreground">
							/ {propertyData.rentType}
						</span>
					)}
				</div>

				{isDraft ? (
					<div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
						<Clock className="h-3 w-3" />
						<span>
							Last saved:{" "}
							{new Date(
								(data as PropertyDraftData).lastSaved,
							).toLocaleDateString()}
						</span>
					</div>
				) : (
					<div className="mt-3 flex items-center justify-between border-t border-border pt-3">
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Eye className="h-4 w-4" />
								<span>{(data as Property).viewCount || 0}</span>
							</div>
							<div className="flex items-center gap-1">
								<Heart className="h-4 w-4" />
								<span>0</span> {/* TODO: Add favorites count */}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
