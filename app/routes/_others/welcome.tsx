import { Key, Home, Wrench } from "lucide-react";
import type { Route } from "./+types/welcome";
import { auth } from "~/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { updateUser } from "~/lib/auth.client";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const authz = await auth.api.getSession({ headers: request.headers });
	return { name: authz?.user?.name.split(" ")[0] || "Guest" };
};

const roles = [
	{
		id: "seeker" as const,
		icon: Key,
		title: "I'm looking for a property",
		description:
			"Search listings, save your favorites, and find your next home.",
	},
	{
		id: "owner" as const,
		icon: Home,
		title: "I want to list a property",
		description:
			"Manage your listings, connect with tenants, and track your success.",
	},
	{
		id: "provider" as const,
		icon: Wrench,
		title: "I offer pro services",
		description: "Showcase your skills, find jobs, and grow your business.",
	},
];

export default function Page({ loaderData }: Route.ComponentProps) {
	const { name } = loaderData;
	const navigate = useNavigate();

	const roleHandler = async (mode: string) => {
		try {
			await updateUser(
				{ mode },
				{
					onError: (ctx) => {
						toast.error("Something went wrong", {
							description: ctx.error.message,
						});
						navigate(0);
					},
					onSuccess: () => {
						navigate(`/${mode}`, {
							replace: true,
						});
					},
				},
			);
		} catch (error) {
			console.error("Error updating user role:", error);
			navigate(0);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
			<div className="w-full max-w-4xl">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground">
						Welcome, {name}! How will you be using the platform today?
					</h2>
					<p className="text-lg max-w-2xl mx-auto text-muted-foreground">
						Choose your role to get started with a personalized experience
					</p>
				</div>
				{/* Role Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{roles.map((role) => {
						const IconComponent = role.icon;
						return (
							<Card
								key={role.id}
								onClick={() => roleHandler(role.id)}
								className="transition-colors hover:bg-muted/50 cursor-pointer"
							>
								<CardHeader className="flex items-center justify-between space-y-4">
									<div className="size-16 border border-border rounded-xl flex items-center justify-center bg-card">
										<IconComponent
											className="size-8 text-primary"
											strokeWidth={1.5}
										/>
									</div>
									<CardTitle className="text-xl text-foreground">
										{role.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="leading-relaxed text-muted-foreground">
										{role.description}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
				<div className="text-center mt-12">
					<p className="text-sm text-muted-foreground">
						Don't worry, you can always change this later in your settings
					</p>
				</div>
			</div>
		</div>
	);
}
