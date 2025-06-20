import { Link, useMatch, useNavigate } from "react-router";
import { toast } from "sonner";
import { signOut, useSession } from "~/lib/auth.client";
import { getRoutes } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function NavBar() {
	if (typeof window === "undefined") {
		return (
			<footer className="fixed left-0 right-0 bg-background flex items-center justify-between bottom-0 border-t gap-2 px-4 py-2 backdrop-blur-lg z-20">
				<Skeleton className="size-10 rounded-md" />
				<Skeleton className="size-10 rounded-md" />
				<Skeleton className="size-10 rounded-md" />
				<Skeleton className="size-10 rounded-md" />
				<Skeleton className="size-12 rounded-full" />
			</footer>
		);
	}
	const { data } = useSession();
	const navigate = useNavigate();
	const signOutHandler = async () => {
		try {
			await signOut();
			toast.success("Logged out successfully");
			navigate("/");
		} catch (error) {
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Internal server error",
			});
		}
	};
	return (
		<footer className="fixed left-0 right-0 bg-background flex items-center justify-between bottom-0 border-t gap-2 px-4 py-2 backdrop-blur-lg z-20">
			{getRoutes(data?.user.mode ?? "").map((route) => {
				const IconComponent = route.icon;
				return (
					<Link
						key={route.path}
						to={route.path}
						className={cn(
							"flex flex-col items-center text-sm text-muted-foreground hover:text-foreground",
							useMatch(route.path) ? "text-primary" : "",
						)}
					>
						<IconComponent className="size-6" />
						<span>{route.title}</span>
					</Link>
				);
			})}
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src={data?.user.image ?? ""} />
						<AvatarFallback>{data?.user.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link to={"/profile"}>Profile</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to={"/billing"}>Billing</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to={"/settings"}>Settings</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link to={"/support"}>Support</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={signOutHandler}>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</footer>
	);
}
