import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
	CardFooter,
} from "~/components/ui/card";
import { forgetPassword } from "~/lib/auth.client";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";

export default function Page() {
	const [loading, setLoading] = useState(false);
	const forgetHandler = async (form: FormData) => {
		setLoading(true);
		const email = form.get("email") as string;
		try {
			await forgetPassword(
				{ email, redirectTo: "/reset-password" },
				{
					onError: (ctx) => {
						toast.error("Something went wrong", {
							description: ctx.error.message,
						});
					},
					onSuccess: () => {
						toast.success("Password reset link sent to your email");
					},
				},
			);
		} catch (error) {
			toast.error("Something went wrong", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="w-full max-w-sm">
			<Card>
				<CardHeader>
					<CardTitle>Forgot Password</CardTitle>
					<CardDescription>
						Enter your email to reset your password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<form action={forgetHandler} className="grid gap-6">
							<Input
								name="email"
								type="email"
								placeholder="you@example.com"
								required
							/>
							<Button type="submit" disabled={loading}>
								{loading ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									"Send Reset Link"
								)}
							</Button>
						</form>
						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link to="/login" className="underline underline-offset-4">
								Log in
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
