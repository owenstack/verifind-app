import { useLocation } from "react-router";
import { cn } from "~/lib/utils";

export function Menu({
	leftElement,
	rightElement,
	className,
}: {
	leftElement?: React.ReactNode;
	rightElement?: React.ReactNode;
	className?: string;
}) {
	const location = useLocation();
	const pathName = location.pathname.split("/").pop() || "";
	const formattedTitle = pathName.replace(/-/g, " ");
	const capitalizedTitle =
		formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);

	return (
		<div
			className={cn(
				"top-0 flex items-center px-2 py-4 justify-between",
				className,
			)}
		>
			<div className="flex-1">{leftElement}</div>
			<span className="font-semibold absolute left-1/2 -translate-x-1/2">
				{capitalizedTitle}
			</span>
			<div className="flex-1 flex justify-end">{rightElement}</div>
		</div>
	);
}
