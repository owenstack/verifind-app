import { Clock, Eye, Heart } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import type { Property } from "~/db/property.schema";
import type { PropertyDraftData } from "~/lib/draft/types";
import { cn } from "~/lib/utils";

interface PropertyCardProps {
	type: "property" | "draft";
	data: Property | PropertyDraftData;
	showBorder?: boolean;
}

export function PropertyCard({ type, data, showBorder }: PropertyCardProps) {
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
	const linkTo = isDraft
		? `/owner/listings/new?draftId=${(data as PropertyDraftData).id}`
		: `/owner/properties/${(data as Property).id}`;

	return (
		<Link to={linkTo} className="block">
			<div
				className={cn("p-4 bg-card", showBorder && "border-b border-border")}
			>
				<div className="flex items-stretch justify-between gap-4">
					<div className="flex flex-col gap-2 flex-[2_2_0px]">
						<div className="flex items-center gap-2">
							<p className="text-muted-foreground text-sm font-normal">
								{isDraft ? "Draft" : "Listing"}
							</p>
							<Badge variant={statusInfo.variant} className="text-xs">
								{statusInfo.label}
							</Badge>
						</div>

						<h3 className="text-foreground text-base font-bold line-clamp-2">
							{propertyData?.title || "Untitled Property"}
						</h3>

						<p className="text-muted-foreground text-sm font-normal line-clamp-1">
							{propertyData?.address ||
								propertyData?.area ||
								"Location not set"}
						</p>

						<div className="flex items-center gap-2 text-sm text-foreground">
							<span className="font-medium">
								{formatPrice(propertyData?.price)}
							</span>
							{propertyData?.rentType && (
								<span className="text-muted-foreground">
									/ {propertyData.rentType}
								</span>
							)}
						</div>

						{isDraft && (
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<Clock className="h-3 w-3" />
								<span>
									Last saved:{" "}
									{new Date(
										(data as PropertyDraftData).lastSaved,
									).toLocaleDateString()}
								</span>
							</div>
						)}
					</div>

					<div
						className="w-20 h-16 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0 bg-muted"
						style={{ backgroundImage: `url("${imageUrl}")` }}
						aria-label="Property image"
					/>
				</div>

				{!isDraft && (
					<div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
						<p className="text-muted-foreground text-sm">
							Listing: {statusInfo.label} · Rental: {statusInfo.description}
						</p>

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
		</Link>
	);
}
