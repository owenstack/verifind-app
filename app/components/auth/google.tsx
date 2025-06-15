import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Google } from "~/assets/google";
import { Button } from "~/components/ui/button";
import { signIn } from "~/lib/auth.client";

export function GoogleSignIn() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleSignIn = async () => {
		try {
			setLoading(true);
			await signIn.social(
				{ provider: "google", callbackURL: "/" },
				{
					onError: (ctx) => {
						toast.error("Something went wrong", {
							description: ctx.error.message,
						});
					},
					onSuccess: () => {
						toast.success("Successfully signed in with Google");
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
		<Button onClick={handleSignIn} disabled={loading}>
			{loading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<span className="flex items-center gap-2">
					<Google className="mr-2 h-4 w-4" />
					<span>Continue with Google</span>
				</span>
			)}
		</Button>
	);
}
