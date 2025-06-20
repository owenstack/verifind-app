import {
	type LucideIcon,
	ScanSearch,
	FolderHeart,
	MessageSquareMore,
	LayoutPanelTop,
	Building2,
	BriefcaseBusiness,
} from "lucide-react";

export const getRoutes = (
	role: "seeker" | "provider" | "owner" | string,
): { title: string; path: string; icon: LucideIcon }[] => {
	if (role === "seeker") {
		return [
			{ title: "Search", path: "/seeker", icon: ScanSearch },
			{
				title: "Favorites",
				path: "/seeker/favorites",
				icon: FolderHeart,
			},
			{ title: "Messages", path: "/seeker/messages", icon: MessageSquareMore },
		];
	}
	if (role === "owner") {
		return [
			{ title: "Dashboard", path: "/owner", icon: LayoutPanelTop },
			{ title: "Listings", path: "/owner/listings", icon: Building2 },
			{ title: "Messages", path: "/owner/messages", icon: MessageSquareMore },
		];
	}
	return [
		{ title: "Dashboard", path: "/provider", icon: LayoutPanelTop },
		{ title: "Listings", path: "/provider/jobs", icon: BriefcaseBusiness },
		{ title: "Messages", path: "/provider/messages", icon: MessageSquareMore },
	];
};
