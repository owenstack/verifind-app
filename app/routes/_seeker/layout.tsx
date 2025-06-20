import { Outlet } from "react-router";
import { NavBar } from "~/components/navbar";

export default function SeekerLayout() {
	return (
		<div className="flex flex-col min-h-svh w-full">
			<div className="flex-1 overflow-auto p-6 md:p-10 pb-24">
				<Outlet />
			</div>
			<NavBar />
		</div>
	);
}
