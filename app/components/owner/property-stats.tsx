interface PropertyStatsData {
	totalViews: number;
	totalFavorites: number;
	activeListings: number;
	draftListings: number;
}

interface PropertyStatsProps {
	stats: PropertyStatsData;
}

export function PropertyStats({ stats }: PropertyStatsProps) {
	return (
		<div className="flex flex-wrap gap-4 p-4 bg-background">
			<div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border bg-card">
				<p className="text-foreground text-base font-medium">Total Views</p>
				<p className="text-foreground text-2xl font-bold">
					{stats.totalViews.toLocaleString()}
				</p>
			</div>
			<div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border bg-card">
				<p className="text-foreground text-base font-medium">Favorites</p>
				<p className="text-foreground text-2xl font-bold">
					{stats.totalFavorites.toLocaleString()}
				</p>
			</div>
		</div>
	);
}
