import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signIn } from "~/lib/auth.client";
import { GoogleSignIn } from "./google";

export function LoginForm() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (form: FormData) => {
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		setLoading(true);
		try {
			await signIn.email(
				{ email, password },
				{
					onError: (ctx) => {
						toast.error("Something went wrong", {
							description: ctx.error.message,
						});
					},
					onSuccess: () => {
						toast.success("Successfully logged in");
						navigate("/");
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
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<form className="grid gap-6" action={handleLogin}>
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									name="email"
									autoComplete="email"
									placeholder="m@example.com"
									required
								/>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<Link
										to="/forgot-password"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									name="password"
									autoComplete="current-password"
									required
								/>
							</div>
							<Button type="submit" disabled={loading} className="w-full">
								{loading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Login"
								)}
							</Button>
						</form>
						<GoogleSignIn />
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link to="/signup" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
