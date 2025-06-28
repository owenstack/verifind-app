import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";
import { property } from "./property.schema";

// Inquiry table for tracking property inquiries
export const request = sqliteTable(
	"request",
	{
		id: text("id").primaryKey(),
		propertyId: text("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		seekerId: text("seeker_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		// Inquiry details
		message: text("message").notNull(),
		status: text("status", {
			enum: ["pending", "accepted", "rejected", "closed"],
		})
			.notNull()
			.default("pending"),
		type: text("type", { enum: ["maintenance", "inquiry"] }).notNull(),
		// Contact information at the time of inquiry
		contactName: text("contact_name").notNull(),
		contactEmail: text("contact_email").notNull(),
		contactPhone: text("contact_phone"),

		// Metadata
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => sql`(unixepoch())`),
	},
	(table) => [
		index("inquiry_property_idx").on(table.propertyId),
		index("inquiry_seeker_idx").on(table.seekerId),
		index("inquiry_status_idx").on(table.status),
	],
);

// Export types for TypeScript
export type Request = typeof request.$inferSelect;
