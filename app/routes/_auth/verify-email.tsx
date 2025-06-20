import { auth } from "~/lib/auth";
import type { Route } from "./+types/verify-email";
import { useNavigate, useSearchParams } from "react-router";
import { verifyEmail, sendVerificationEmail } from "~/lib/auth.client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

export const loader = async ({ request }: Route.LoaderArgs) => {
	try {
		const authz = await auth.api.getSession({ headers: request.headers });
		return { error: null, email: authz?.user.email };
	} catch (error) {
		console.error(error instanceof Error ? error.message : "Unknown error");
		return {
			error: error instanceof Error ? error.message : "Unknown error",
			email: null,
		};
	}
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { error, email } = loaderData;
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [verified, setVerified] = useState(false);

	useEffect(() => {
		if (error) {
			navigate("/login");
			return;
		}

		const handleVerification = async () => {
			if (token) {
				setLoading(true);
				try {
					await verifyEmail(
						{ query: { token } },
						{
							onSuccess: () => {
								toast.success("Email verified successfully");
								setVerified(true);
								setTimeout(() => navigate("/dashboard"), 2000);
							},
							onError: (ctx) => {
								toast.error("Failed to verify email", {
									description: ctx.error.message,
								});
							},
						},
					);
				} catch (error) {
					toast.error("Something went wrong", {
						description:
							error instanceof Error ? error.message : "Internal server error",
					});
				} finally {
					setLoading(false);
				}
			} else if (email) {
				setLoading(true);
				try {
					await sendVerificationEmail(
						{ email, callbackURL: "/verify-email" },
						{
							onError: (ctx) => {
								toast.error("Failed to send verification email", {
									description: ctx.error.message,
								});
							},
							onSuccess: () => {
								toast.success(
									"Verification email sent. Please check your inbox",
								);
							},
						},
					);
				} catch (error) {
					toast.error("Something went wrong", {
						description:
							error instanceof Error ? error.message : "Internal server error",
					});
				} finally {
					setLoading(false);
				}
			}
		};

		handleVerification();
	}, [token, email, error, navigate]);

	return (
		<div className="w-full max-w-sm space-y-4 text-center">
			<h1 className="text-2xl font-bold">Email Verification</h1>
			{loading ? (
				<div className="flex justify-center">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			) : verified ? (
				<div className="flex flex-col items-center gap-2">
					<CheckCircle className="h-8 w-8 text-green-500" />
					<p>Email verified successfully! Redirecting...</p>
				</div>
			) : (
				<p>
					{token
						? "Verifying your email..."
						: "Please check your email for the verification link"}
				</p>
			)}
		</div>
	);
}
