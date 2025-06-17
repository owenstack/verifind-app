import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../utils";
import { passwordResetString } from "workers/mailer/emails/password-reset";
import { Resend } from "resend";
import { env } from "cloudflare:workers";

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
					subject: "Password Reset",
					html: body,
				});
			} catch (error) {
				console.error(error instanceof Error ? error.message : "Unknown error");
			}
		}),
} satisfies TRPCRouterRecord;
