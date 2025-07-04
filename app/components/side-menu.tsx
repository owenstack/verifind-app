import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useMatch } from "react-router";
import { useSession } from "~/lib/auth.client";
import { getMenuLinks } from "~/lib/constants";
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
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
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

	return (
		<Sheet>
			<SheetTrigger className="p-2">
				<Menu className="size-6" />
			</SheetTrigger>
			<SheetContent side="left" className="w-64">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<SideMenuContent />
			</SheetContent>
		</Sheet>
	);
}

function SideMenuContent() {
	const { data } = useSession();
	const match = useMatch("*");
	const isActive = (path: string) => match?.pathname === path;
	return (
		<nav className="flex flex-col gap-2 p-4">
			{getMenuLinks(data?.user.mode ?? "").map((link) => (
				<Link
					key={link.path}
					to={link.path}
					className={buttonVariants({
						variant: isActive(link.path) ? "secondary" : "ghost",
					})}
				>
					<link.icon className="size-5" />
					<span>{link.title}</span>
				</Link>
			))}
		</nav>
	);
}
