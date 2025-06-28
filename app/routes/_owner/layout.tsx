import { Plus } from "lucide-react";
import { Link, Outlet } from "react-router";
import { Menu } from "~/components/menu";
import { NavBar } from "~/components/navbar";
import { buttonVariants } from "~/components/ui/button";

export default function OwnerLayout() {
	return (
		<div className="flex flex-col min-h-svh w-full">
			<Menu
				rightElement={
					<Link
						to="/owner/listings/new"
						className={buttonVariants({ variant: "ghost" })}
					>
						<Plus className="size-6" />
					</Link>
				}
			/>
			<div className="flex-1 overflow-auto p-6 md:p-10 pb-24">
				<Outlet />
			</div>
			<NavBar />
		</div>
	);
}
