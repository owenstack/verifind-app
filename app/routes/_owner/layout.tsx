import { Outlet } from "react-router";

export default function SeekerLayout() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<Outlet />
		</div>
	);
}
