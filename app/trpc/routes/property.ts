import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { property } from "~/db/property.schema";
import { insertPropertySchema } from "~/db/property.zod";
import { protectedProcedure } from "../utils";

export const propertyRouter = {
	publishProperty: protectedProcedure
		.input(insertPropertySchema)
		.mutation(async ({ input, ctx }) => {
			try {
				const { db, user } = ctx;
				if (user.mode !== "owner") {
					return { error: "You are not authorized to publish properties." };
				}
				const { error, data } =
					await insertPropertySchema.safeParseAsync(input);
				if (error) {
					return { error: "Invalid input data." };
				}
				await db.insert(property).values(data);
				return { success: true, message: "Property published successfully." };
			} catch (error) {
				console.error("Error publishing property:", error);
				return {
					error:
						error instanceof Error
							? error.message
							: "An unexpected error occurred.",
				};
			}
		}),
	getProperties: protectedProcedure.query(async ({ ctx }) => {
		try {
			const { db, user } = ctx;
			if (user.mode !== "owner") {
				return { error: "You are not authorized to view properties." };
			}
			const properties = await db
				.select()
				.from(property)
				.where(eq(property.ownerId, user.id));
			return { success: true, data: properties };
		} catch (error) {
			console.error("Error fetching properties:", error);
			return {
				error:
					error instanceof Error
						? error.message
						: "An unexpected error occurred.",
			};
		}
	}),
} satisfies TRPCRouterRecord;
