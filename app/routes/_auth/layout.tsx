import { Outlet } from "react-router";
import { FlickeringGrid } from "~/components/ui/flickering-grid";

export default function AuthLayout() {
	return (
		<div className="grid min-h-svh place-items-center p-6 md:p-10">
			<FlickeringGrid
				className="fixed inset-0 z-0 size-full opacity-50"
				squareSize={4}
				gridGap={6}
				color="#52525B"
				maxOpacity={0.3}
				flickerChance={0.1}
				height={800}
				width={800}
			/>
			<div className="relative z-10 w-full max-w-sm">
				<Outlet />
			</div>
		</div>
	);
}
