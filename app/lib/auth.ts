import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "~/db";
import { client } from "~/trpc/client";

export const auth = betterAuth({
	appName: "VeriFind",
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
		async sendResetPassword({ user, token }) {
			await client.mailer.resetPasswordMail.mutate({
				email: user.email,
				link: token,
				name: user.name,
			});
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	user: {
		additionalFields: {
			onboarded: {
				type: "boolean",
				default: false,
				input: true,
			},
			mode: {
				type: "string",
				input: true,
			},
		},
	},
	plugins: [admin()],
});
