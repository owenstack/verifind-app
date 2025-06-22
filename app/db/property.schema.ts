import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

// Main property table
export const property = sqliteTable(
	"property",
	{
		// Primary identifiers
		id: text("id").primaryKey(),
		ownerId: text("owner_id") // snake_case for consistency
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }), // Added cascade delete

		// Basic property info
		title: text("title").notNull(),
		description: text("description").notNull(), // Made required for better listings
		type: text("type", {
			enum: [
				"apartment",
				"house",
				"duplex",
				"bungalow",
				"flat",
				"room",
				"shop",
				"office",
				"warehouse",
				"villa",
				"penthouse",
				"studio",
				"land", // Added for plots/vacant land
				"commercial", // Generic commercial space
			],
		}).notNull(),

		// Status management
		status: text("status", {
			enum: [
				"draft",
				"pending",
				"active",
				"inactive",
				"rented",
				"sold",
				"reserved",
				"expired",
			],
		})
			.notNull()
			.default("draft"),

		// Pricing - using REAL for better decimal support
		price: real("price").notNull(), // Changed to real for decimal prices
		currency: text("currency").notNull().default("NGN"),
		rentType: text("rent_type", {
			enum: ["monthly", "yearly", "weekly", "daily", "per_sqm"], // Added per_sqm for commercial
		}),
		negotiable: integer("negotiable", { mode: "boolean" }).default(false),
		// serviceCharge: real("service_charge"), // For apartments with service charges
		// cautionFee: real("caution_fee"), // Security deposit

		// Location - normalized structure
		area: text("area").notNull(),
		state: text("state").notNull().default("Lagos"),
		address: text("address").notNull(),
		latitude: real("latitude"), // Changed to real for precision, made optional
		longitude: real("longitude"), // Changed to real for precision, made optional
		landmarks: text("landmarks", { mode: "json" }).$type<string[]>(), // Explicit JSON mode

		// Property features
		bedrooms: integer("bedrooms").notNull().default(0), // 0 for studios/shops
		bathrooms: integer("bathrooms").notNull().default(1),
		toilets: integer("toilets").default(0), // Separate from bathrooms for Nigerian context
		furnished: integer("furnished", { mode: "boolean" })
			.notNull()
			.default(false),
		furnishingLevel: text("furnishing_level", {
			enum: [
				"unfurnished",
				"semi_furnished",
				"fully_furnished",
				"luxury_furnished",
			],
		}),
		amenities: text("amenities", { mode: "json" }).$type<string[]>(),
		utilities: text("utilities", { mode: "json" }).$type<string[]>(),

		// Property specifications
		yearBuilt: integer("year_built"),
		totalArea: real("total_area"), // Square meters, real for precision
		plotSize: real("plot_size"), // Square meters for land area
		floorLevel: integer("floor_level"),
		totalFloors: integer("total_floors"),
		parkingSpaces: integer("parking_spaces").default(0),

		// Additional features
		hasGarden: integer("has_garden", { mode: "boolean" }).default(false),
		hasPool: integer("has_pool", { mode: "boolean" }).default(false),
		hasSecurity: integer("has_security", { mode: "boolean" }).default(false),
		hasGenerator: integer("has_generator", { mode: "boolean" }).default(false),

		// Contact preferences - moved to separate table for flexibility
		primaryContact: text("primary_contact", {
			enum: ["phone", "email", "whatsapp"],
		}).default("phone"),

		// Business logic fields
		featured: integer("featured", { mode: "boolean" }).default(false),
		verified: integer("verified", { mode: "boolean" }).default(false), // Admin verification
		viewCount: integer("view_count").default(0),
		completionScore: integer("completion_score").default(0),

		// Metadata
		publishedAt: integer("published_at", { mode: "timestamp" }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`), // Auto-timestamp
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`)
			.$onUpdate(() => sql`(unixepoch())`), // Auto-update timestamp
		expiresAt: integer("expires_at", { mode: "timestamp" }), // For auto-expiring listings

		// SEO and search
		slug: text("slug"), // URL-friendly version of title
		tags: text("tags", { mode: "json" }).$type<string[]>(), // For categorization
	},
	(table) => [
		// Indexes for performance
		index("property_owner_idx").on(table.ownerId),
		index("property_status_idx").on(table.status),
		index("property_area_idx").on(table.area),
		index("property_type_idx").on(table.type),
		index("property_price_idx").on(table.price),
		index("property_bedrooms_idx").on(table.bedrooms),
		index("property_published_idx").on(table.publishedAt),
		index("property_featured_idx").on(table.featured),
		index("property_location_idx").on(table.latitude, table.longitude),

		// Composite indexes for common queries
		index("property_status_area_idx").on(table.status, table.area),
		index("property_type_bedrooms_idx").on(table.type, table.bedrooms),
		index("property_price_range_idx").on(table.price, table.status),

		// Unique constraints
		uniqueIndex("property_slug_unique_idx").on(table.slug),

		// Check constraints for data integrity
		check("price_positive", sql`${table.price} > 0`),
		check(
			"bedrooms_valid",
			sql`${table.bedrooms} >= 0 AND ${table.bedrooms} <= 20`,
		),
		check(
			"bathrooms_valid",
			sql`${table.bathrooms} >= 0 AND ${table.bathrooms} <= 20`,
		),
		check(
			"completion_score_valid",
			sql`${table.completionScore} >= 0 AND ${table.completionScore} <= 100`,
		),
	],
);

// Separate table for property images - normalized approach
export const propertyImage = sqliteTable(
	"property_image",
	{
		id: text("id").primaryKey(),
		propertyId: text("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),

		// Image URLs and metadata
		url: text("url").notNull(),
		thumbnailUrl: text("thumbnail_url").notNull(),
		mediumUrl: text("medium_url"), // Additional size variant
		altText: text("alt_text"),
		caption: text("caption"), // User-provided description

		// Image properties
		isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
		order: integer("order").notNull().default(0),
		width: integer("width"),
		height: integer("height"),
		fileSize: integer("file_size"), // In bytes
		format: text("format"), // jpg, png, webp, etc.

		// Cloudflare specific
		cloudflareId: text("cloudflare_id"), // Cloudflare Images ID
		r2Key: text("r2_key"), // R2 backup key

		// Metadata
		uploadedAt: integer("uploaded_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
	(table) => [
		// Indexes
		index("property_image_property_idx").on(table.propertyId),
		index("property_image_order_idx").on(table.propertyId, table.order),
		index("property_image_primary_idx").on(table.propertyId, table.isPrimary),

		// Ensure only one primary image per property
		uniqueIndex("property_image_unique_primary_idx")
			.on(table.propertyId)
			.where(sql`${table.isPrimary} = 1`),
	],
);

// Contact information - separate table for flexibility
export const propertyContact = sqliteTable(
	"property_contact",
	{
		id: text("id").primaryKey(),
		propertyId: text("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),

		type: text("type", {
			enum: ["phone", "email", "whatsapp", "telegram"],
		}).notNull(),
		value: text("value").notNull(),
		label: text("label"), // e.g., "Primary", "WhatsApp", "Office"
		isPreferred: integer("is_preferred", { mode: "boolean" }).default(false),
		isVerified: integer("is_verified", { mode: "boolean" }).default(false),

		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
	(table) => [
		index("property_contact_property_idx").on(table.propertyId),
		index("property_contact_type_idx").on(table.type),
	],
);

// Property views tracking - for analytics
export const propertyView = sqliteTable(
	"property_view",
	{
		id: text("id").primaryKey(),
		propertyId: text("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),

		// Visitor information (anonymous)
		visitorId: text("visitor_id"), // Could be session ID or user ID
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		referrer: text("referrer"),

		// View metadata
		viewedAt: integer("viewed_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
		duration: integer("duration"), // Time spent viewing in seconds
	},
	(table) => [
		index("property_view_property_idx").on(table.propertyId),
		index("property_view_viewed_at_idx").on(table.viewedAt),
		index("property_view_visitor_idx").on(table.visitorId),
	],
);

// Property search history - for improving search
export const propertySearch = sqliteTable(
	"property_search",
	{
		id: text("id").primaryKey(),
		userId: text("user_id").references(() => user.id), // Optional, for logged-in users

		query: text("query").notNull(),
		filters: text("filters", { mode: "json" }).$type<Record<string, unknown>>(),
		resultsCount: integer("results_count").default(0),

		searchedAt: integer("searched_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
	(table) => [
		index("property_search_user_idx").on(table.userId),
		index("property_search_query_idx").on(table.query),
		index("property_search_searched_at_idx").on(table.searchedAt),
	],
);

// Export types for TypeScript
export type Property = typeof property.$inferSelect;
export type PropertyImage = typeof propertyImage.$inferSelect;
export type PropertyContact = typeof propertyContact.$inferSelect;
