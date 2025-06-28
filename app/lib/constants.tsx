import {
	BriefcaseBusiness,
	Building2,
	CheckCircle,
	DollarSign,
	FolderHeart,
	Heart,
	Home,
	LayoutPanelTop,
	type LucideIcon,
	MessageSquareMore,
	Plus,
	ScanSearch,
	Search,
	Shield,
	Trophy,
	Users,
	Wrench,
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

export const getMenuLinks = (
	role: "seeker" | "provider" | "owner" | string,
): { title: string; path: string; icon: LucideIcon }[] => {
	if (role === "owner") {
		return [
			{ title: "New listing", path: "/owner/listings/new", icon: Plus },
			{ title: "Drafts", path: "/owner/drafts", icon: FolderHeart },
			{ title: "Maintenance", path: "/owner/maintenance", icon: Wrench },
			{ title: "Inquiries", path: "/owner/inquiries", icon: ScanSearch },
			{ title: "Analytics", path: "/owner/analytics", icon: DollarSign },
		];
	}
	return [];
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

export const ownerOnboardingSlides: OnboardingContent[] = [
	{
		icon: Home,
		title: "List Your Properties",
		description:
			"Showcase your properties with detailed listings, photos, and key features to attract quality tenants.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 sm:p-6">
					<div className="w-full h-full bg-white rounded-xl shadow-sm relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-600" />
						<div className="absolute bottom-2 left-2 right-2">
							<div className="w-full h-1.5 sm:h-2 bg-white/40 rounded-full mb-1" />
							<div className="w-2/3 h-1.5 sm:h-2 bg-white/40 rounded-full mb-1" />
							<div className="w-1/2 h-1.5 sm:h-2 bg-white/40 rounded-full" />
						</div>
					</div>
				</div>
				<div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
					<Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
				</div>
			</div>
		),
	},
	{
		icon: DollarSign,
		title: "Maximize Your Income",
		description:
			"Set competitive rates and track your rental income with our built-in analytics tools.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl flex items-center justify-center">
					<div className="w-20 h-20 sm:w-28 sm:h-28 bg-green-500 rounded-full flex items-center justify-center shadow-lg relative">
						<DollarSign
							className="w-10 h-10 sm:w-14 sm:h-14 text-white"
							strokeWidth={2}
						/>
						<div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
							<span className="text-xs sm:text-sm font-bold text-green-800">
								+
							</span>
						</div>
					</div>
				</div>
				<div className="absolute -bottom-2 -left-2 w-4 h-4 sm:w-6 sm:h-6 bg-emerald-400 rounded-full animate-bounce" />
				<div className="absolute -top-1 -left-3 w-3 h-3 sm:w-4 sm:h-4 bg-green-300 rounded-full animate-bounce delay-300" />
			</div>
		),
	},
	{
		icon: Shield,
		title: "Verified & Protected",
		description:
			"Your properties are showcased to verified tenants with our comprehensive screening process.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl flex items-center justify-center">
					<div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
						<Shield
							className="w-8 h-8 sm:w-12 sm:h-12 text-white"
							strokeWidth={1.5}
						/>
					</div>
				</div>
				<div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
					<div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
				</div>
				<div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 bg-cyan-400 rounded-full animate-pulse" />
			</div>
		),
	},
];

// Service Provider Onboarding Slides
export const serviceProviderOnboardingSlides: OnboardingContent[] = [
	{
		icon: Wrench,
		title: "Showcase Your Skills",
		description:
			"Create a professional profile highlighting your expertise, certifications, and service areas.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-4 sm:p-6">
					<div className="w-full h-full bg-white rounded-xl shadow-sm flex flex-col items-center justify-center gap-2">
						<div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center">
							<Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
						</div>
						<div className="w-3/4 h-1 sm:h-1.5 bg-gray-200 rounded-full" />
						<div className="w-1/2 h-1 sm:h-1.5 bg-gray-200 rounded-full" />
					</div>
				</div>
				<div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
					<div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
				</div>
			</div>
		),
	},
	{
		icon: Users,
		title: "Connect with Clients",
		description:
			"Get matched with property owners and tenants who need your services in your area.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl flex items-center justify-center">
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
							<Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
						</div>
						<div className="flex flex-col gap-1">
							<div className="w-12 h-1 sm:w-16 sm:h-1.5 bg-purple-300 rounded-full" />
							<div className="w-8 h-1 sm:w-12 sm:h-1.5 bg-purple-200 rounded-full" />
						</div>
					</div>
				</div>
				<div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
					<div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />
				</div>
				<div className="absolute -top-1 -left-2 w-4 h-4 sm:w-5 sm:h-5 bg-purple-300 rounded-full animate-pulse delay-200" />
			</div>
		),
	},
	{
		icon: Trophy,
		title: "Grow Your Business",
		description:
			"Build your reputation with reviews and expand your client base through VeriFind.",
		illustration: (
			<div className="relative">
				<div className="w-full max-w-[16rem] h-auto aspect-[1.6] bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl flex items-center justify-center">
					<div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
						<Trophy
							className="w-8 h-8 sm:w-12 sm:h-12 text-white"
							strokeWidth={1.5}
						/>
					</div>
				</div>
				<div className="absolute -top-2 -left-2 w-5 h-5 sm:w-7 sm:h-7 bg-yellow-400 rounded-full animate-bounce" />
				<div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-orange-400 rounded-full animate-bounce delay-150" />
				<div className="absolute top-4 -right-3 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full animate-pulse delay-300" />
			</div>
		),
	},
];
