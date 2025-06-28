import { Menu } from "lucide-react";
import { Link, useMatch } from "react-router";
import { useSession } from "~/lib/auth.client";
import { getMenuLinks } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { buttonVariants } from "./ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

export function SideMenu() {
	if (typeof window === "undefined") {
		return (
			<Sheet>
				<SheetTrigger className="p-2">
					<Menu className="size-6" />
				</SheetTrigger>
				<SheetContent side="left" className="w-64">
					<SheetHeader>
						<SheetTitle>Loading...</SheetTitle>
						<SheetDescription>Please wait</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		);
	}
	const { data } = useSession();
	return (
		<Sheet>
			<SheetTrigger className="p-2">
				<Menu className="size-6" />
			</SheetTrigger>
			<SheetContent side="left" className="w-64">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-2 p-4">
					{getMenuLinks(data?.user.mode ?? "").map((link) => (
						<Link
							key={link.path}
							to={link.path}
							className={buttonVariants({
								variant: useMatch(link.path) ? "secondary" : "ghost",
							})}
						>
							<link.icon className="size-5" />
							<span>{link.title}</span>
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
