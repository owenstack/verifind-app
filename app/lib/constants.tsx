import {
	BriefcaseBusiness,
	Building2,
	CheckCircle,
	FolderHeart,
	Heart,
	LayoutPanelTop,
	type LucideIcon,
	MessageSquareMore,
	ScanSearch,
	Search,
} from "lucide-react";
import type { ReactNode } from "react";

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

export interface OnboardingContent {
	icon: LucideIcon;
	title: string;
	description: string;
	illustration: ReactNode;
}

export const seekerOnboardingSlides: OnboardingContent[] = [
	{
		icon: Search,
		title: "Find Your Perfect Match",
		description:
			"Use our powerful search to find properties by location, price, and more.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
					<div className="w-full max-w-[12rem] h-auto py-3 bg-white rounded-full shadow-sm flex items-center px-4 gap-3">
						<Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
						<span className="text-gray-500 text-xs sm:text-sm truncate">
							Search properties...
						</span>
					</div>
				</div>
				<div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
					<div className="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center">
						<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full" />
					</div>
				</div>
			</div>
		),
	},
	{
		icon: Heart,
		title: "Save Your Favorites",
		description: "Keep track of all the properties you love in one place.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6">
					<div className="w-full h-full bg-white rounded-xl shadow-sm relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600" />
						<div className="absolute bottom-2 left-2 right-2">
							<div className="w-full h-1.5 sm:h-2 bg-white/30 rounded-full mb-1" />
							<div className="w-3/4 h-1.5 sm:h-2 bg-white/30 rounded-full" />
						</div>
					</div>
					<div className="absolute top-6 sm:top-8 right-6 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
						<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
					</div>
				</div>
			</div>
		),
	},
	{
		icon: CheckCircle,
		title: "You're All Set!",
		description: "Ready to start your property search journey with VeriFind.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl flex items-center justify-center">
					<div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
						<CheckCircle
							className="w-8 h-8 sm:w-12 sm:h-12 text-white"
							strokeWidth={1.5}
						/>
					</div>
				</div>
				<div className="absolute -top-2 -left-2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full animate-bounce" />
				<div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-bounce delay-150" />
			</div>
		),
	},
];
