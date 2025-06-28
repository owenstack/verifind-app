import type { TRPCRouterRecord } from "@trpc/server";
import { and, count, desc, eq, sum } from "drizzle-orm";
import { z } from "zod";
import { property } from "~/db/property.schema";
import { insertPropertySchema } from "~/db/property.zod";
import { request } from "~/db/requests.schema";
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
	getOwnerProperties: protectedProcedure.query(async ({ ctx }) => {
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
	getPropertyById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { db, user } = ctx;
				if (user.mode !== "owner") {
					return { error: "You are not authorized to view properties." };
				}
				const properties = await db
					.select()
					.from(property)
					.where(eq(property.id, input.id))
					.limit(1)
					.execute();
				if (!property) {
					return { error: "Property not found." };
				}
				return { success: true, data: properties[0] };
			} catch (error) {
				console.error("Error fetching property:", error);
				return {
					error:
						error instanceof Error
							? error.message
							: "An unexpected error occurred.",
				};
			}
		}),
	deactivateProperty: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				const { db, user } = ctx;
				if (user.mode !== "owner") {
					return { error: "You are not authorized to deactivate properties." };
				}
				const result = await db
					.update(property)
					.set({ status: "inactive" })
					.where(eq(property.id, input.id))
					.execute();
				if (result.error) {
					return { error: "Property not found or already deactivated." };
				}
				return { success: true, message: "Property deactivated successfully." };
			} catch (error) {
				console.error("Error deactivating property:", error);
				return {
					error:
						error instanceof Error
							? error.message
							: "An unexpected error occurred.",
				};
			}
		}),
	deleteProperty: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				const { db, user } = ctx;
				if (user.mode !== "owner") {
					return { error: "You are not authorized to delete properties." };
				}
				const result = await db
					.delete(property)
					.where(eq(property.id, input.id))
					.execute();
				if (result.error) {
					return { error: "Property not found or already deleted." };
				}
				return { success: true, message: "Property deleted successfully." };
			} catch (error) {
				console.error("Error deleting property:", error);
				return {
					error:
						error instanceof Error
							? error.message
							: "An unexpected error occurred.",
				};
			}
		}),
	getOwnerOverview: protectedProcedure.query(async ({ ctx }) => {
		try {
			const { db, user } = ctx;
			if (user.mode !== "owner") {
				return { error: "You are not authorized to view overview." };
			}

			const [
				properties,
				totalViewsResult,
				activeInquiries,
				bestPerforming,
				recentActivity,
			] = await Promise.all([
				db.select().from(property).where(eq(property.ownerId, user.id)),
				db
					.select({ value: sum(property.viewCount) })
					.from(property)
					.where(eq(property.ownerId, user.id))
					.execute(),
				db
					.select({ value: count() })
					.from(request)
					.where(
						and(eq(request.status, "pending"), eq(property.ownerId, user.id)),
					)
					.leftJoin(property, eq(request.propertyId, property.id))
					.execute(),
				db
					.select()
					.from(property)
					.where(eq(property.ownerId, user.id))
					.orderBy(desc(property.viewCount))
					.limit(5)
					.execute(),
				db
					.select()
					.from(request)
					.where(eq(property.ownerId, user.id))
					.orderBy(desc(request.createdAt))
					.limit(10)
					.leftJoin(property, eq(request.propertyId, property.id))
					.execute(),
			]);

			const totalListings = properties.length;
			const activeListings = properties.filter(
				(p) => p.status === "active",
			).length;

			const rentedListings = properties.filter(
				(p) => p.status === "rented",
			).length;

			const occupancyRate =
				totalListings > 0 ? (rentedListings / totalListings) * 100 : 0;

			const totalViews = Number(totalViewsResult[0].value) || 0;

			return {
				success: true,
				data: {
					activeListings,
					activeInquiries: activeInquiries[0].value,
					occupancyRate,
					totalViews,
					bestPerforming,
					recentActivity,
				},
			};
		} catch (error) {
			console.error("Error fetching owner overview:", error);
			return {
				error:
					error instanceof Error
						? error.message
						: "An unexpected error occurred.",
			};
		}
	}),
} satisfies TRPCRouterRecord;
