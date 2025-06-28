import { MoreVertical } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "../ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
import { DeactivateProperty, DeleteProperty } from "./actions";

export function PropertyMenu({ id }: { id: string }) {
	return (
		<Drawer>
			<DrawerTrigger>
				<MoreVertical />
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle className="sr-only">Context menu</DrawerTitle>
				</DrawerHeader>
				<div className="flex flex-col gap-2 p-4">
					<Link
						className={buttonVariants({ variant: "ghost" })}
						to={`/owner/listings/${id}`}
					>
						View listing
					</Link>
					<Link
						className={buttonVariants({ variant: "ghost" })}
						to={`/owner/listings/${id}/edit`}
					>
						Edit
					</Link>
					<Link
						className={buttonVariants({ variant: "ghost" })}
						to={`/owner/listings/maintenance/${id}`}
					>
						View maintenance
					</Link>
					<Link
						className={buttonVariants({ variant: "ghost" })}
						to={`/owner/listings/inquiries/${id}`}
					>
						View inquiries
					</Link>
					<DeactivateProperty id={id} />
					<DeleteProperty id={id} />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
