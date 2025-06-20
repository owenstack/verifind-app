import { env } from "cloudflare:workers";
import type { TRPCRouterRecord } from "@trpc/server";
import { Resend } from "resend";
import { passwordResetString } from "workers/mailer/emails/password-reset";
import { verifyEmailString } from "workers/mailer/emails/verify-email";
import { z } from "zod";
import { publicProcedure } from "../utils";

const resend = new Resend(env.RESEND_API_KEY);

export const mailerRouter = {
	resetPasswordMail: publicProcedure
		.input(
			z.object({
				name: z.string(),
				link: z.string().url(),
				email: z.string().email(),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				const body = await passwordResetString({
					userFirstname: input.name,
					resetPasswordLink: input.link,
				});
				await resend.emails.send({
					from: "Owen <owen@habilens.com>",
					to: input.email,
					subject: "Password Reset - VeriFind",
					html: body,
				});
			} catch (error) {
				console.error(error instanceof Error ? error.message : "Unknown error");
			}
		}),
	verifyEmail: publicProcedure
		.input(
			z.object({
				token: z.string(),
				url: z.string().url(),
				email: z.string().email(),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				const body = await verifyEmailString({
					token: input.token,
					url: input.url,
				});
				await resend.emails.send({
					from: "Owen <owen@habilens.com>",
					to: input.email,
					subject: "Verification Code - VeriFind",
					html: body,
				});
			} catch (error) {
				console.error(error instanceof Error ? error.message : "Unknown error");
			}
		}),
} satisfies TRPCRouterRecord;
