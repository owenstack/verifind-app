import { Link } from "react-router";
import type { Property } from "~/db/property.schema";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

const formatNumber = (num: number) => {
	if (num >= 1000000) {
		const formatted = (num / 1000000).toFixed(1);
		if (formatted.endsWith(".0")) {
			return `${(num / 1000000).toFixed(0)}m`;
		}
		return `${formatted}m`;
	}
	if (num >= 1000) {
		const formatted = (num / 1000).toFixed(1);
		if (formatted.endsWith(".0")) {
			return `${(num / 1000).toFixed(0)}k`;
		}
		return `${formatted}k`;
	}
	return num.toString();
};

export function ActiveListings({ number }: { number: number }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Active Listings</CardTitle>

				<CardDescription className="flex items-center justify-between text-2xl font-bold">
					{formatNumber(number)}
					<p className="text-sm font-normal text-muted-foreground">
						active listings
					</p>
				</CardDescription>
			</CardHeader>
		</Card>
	);
}

export function BestPerforming({ properties }: { properties?: Property[] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Best Performing</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4">
					{properties?.map((property) => (
						<div
							key={property.id}
							className="flex items-center justify-between"
						>
							<div className="flex flex-col">
								<Link to={`/owner/listings/${property.id}`}>
									<p className="text-sm font-medium">{property.title}</p>
								</Link>
								<p className="text-xs text-muted-foreground">
									{property.address}
								</p>
							</div>
							<p className="text-sm font-medium">
								{formatNumber(property.viewCount ?? 0)} views
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function RecentActivity({ activities }: { activities?: any[] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4">
					{activities?.map((activity) => (
						<div
							key={activity.inquiry.id}
							className="flex items-center justify-between"
						>
							<div className="flex flex-col">
								<p className="text-sm font-medium">
									New inquiry for{" "}
									<Link to={`/owner/listings/${activity.property.id}`}>
										{activity.property.title}
									</Link>
								</p>
								<p className="text-xs text-muted-foreground">
									{activity.inquiry.message}
								</p>
							</div>
							<p className="text-sm font-medium">
								{new Date(activity.inquiry.createdAt).toLocaleDateString()}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function OccupancyRate({ rate }: { rate: number }) {
	return (
		<Link to={"/owner/analytics"}>
			<Card>
				<CardHeader>
					<CardTitle>Occupancy rate</CardTitle>
					<CardDescription className="flex items-center justify-between text-2xl font-semibold">
						{rate}%
						<p className="text-sm font-normal text-muted-foreground">
							occupancy rate
						</p>
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}

export function TotalViews({ views }: { views: number }) {
	return (
		<Link to={"/owner/analytics"}>
			<Card>
				<CardHeader>
					<CardTitle>Total views</CardTitle>
					<CardDescription className="flex items-center justify-between text-2xl font-semibold">
						{formatNumber(views)}
						<p className="text-sm font-normal text-muted-foreground">views</p>
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}

export function ActiveInquiries({ number }: { number: number }) {
	return (
		<Link to={"/owner/analytics"}>
			<Card>
				<CardHeader>
					<CardTitle>Active inquiries</CardTitle>
					<CardDescription className="flex items-center justify-between text-2xl font-semibold">
						{formatNumber(number)}
						<p className="text-sm font-normal text-muted-foreground">
							inquiries
						</p>
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}
