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
import { signUp } from "~/lib/auth.client";
import { GoogleSignIn } from "./google";

export function SignupForm() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSignup = async (form: FormData) => {
		const name = form.get("name") as string;
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		setLoading(true);
		try {
			await signUp.email(
				{ name, email, password, mode: "", onboarded: false },
				{
					onError: (ctx) => {
						toast.error("Something went wrong", {
							description: ctx.error.message,
						});
					},
					onSuccess: () => {
						toast.success("Successfully signed up");
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
					<CardTitle>Sign up</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<form className="grid gap-6" action={handleSignup}>
							<div className="grid gap-3">
								<Label htmlFor="name">Full name</Label>
								<Input id="name" name="name" autoComplete="name" required />
							</div>
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
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									name="password"
									autoComplete="new-password"
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
