CREATE TABLE `property` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'NGN' NOT NULL,
	`rent_type` text,
	`negotiable` integer DEFAULT false,
	`area` text NOT NULL,
	`state` text DEFAULT 'Lagos' NOT NULL,
	`address` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`landmarks` text,
	`bedrooms` integer DEFAULT 0 NOT NULL,
	`bathrooms` integer DEFAULT 1 NOT NULL,
	`toilets` integer DEFAULT 0,
	`furnished` integer DEFAULT false NOT NULL,
	`furnishing_level` text,
	`amenities` text,
	`utilities` text,
	`year_built` integer,
	`total_area` real,
	`plot_size` real,
	`floor_level` integer,
	`total_floors` integer,
	`parking_spaces` integer DEFAULT 0,
	`has_garden` integer DEFAULT false,
	`has_pool` integer DEFAULT false,
	`has_security` integer DEFAULT false,
	`has_generator` integer DEFAULT false,
	`primary_contact` text DEFAULT 'phone',
	`featured` integer DEFAULT false,
	`verified` integer DEFAULT false,
	`view_count` integer DEFAULT 0,
	`completion_score` integer DEFAULT 0,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`expires_at` integer,
	`slug` text,
	`tags` text,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "price_positive" CHECK("property"."price" > 0),
	CONSTRAINT "bedrooms_valid" CHECK("property"."bedrooms" >= 0 AND "property"."bedrooms" <= 20),
	CONSTRAINT "bathrooms_valid" CHECK("property"."bathrooms" >= 0 AND "property"."bathrooms" <= 20),
	CONSTRAINT "completion_score_valid" CHECK("property"."completion_score" >= 0 AND "property"."completion_score" <= 100)
);
--> statement-breakpoint
CREATE INDEX `property_owner_idx` ON `property` (`owner_id`);--> statement-breakpoint
CREATE INDEX `property_status_idx` ON `property` (`status`);--> statement-breakpoint
CREATE INDEX `property_area_idx` ON `property` (`area`);--> statement-breakpoint
CREATE INDEX `property_type_idx` ON `property` (`type`);--> statement-breakpoint
CREATE INDEX `property_price_idx` ON `property` (`price`);--> statement-breakpoint
CREATE INDEX `property_bedrooms_idx` ON `property` (`bedrooms`);--> statement-breakpoint
CREATE INDEX `property_published_idx` ON `property` (`published_at`);--> statement-breakpoint
CREATE INDEX `property_featured_idx` ON `property` (`featured`);--> statement-breakpoint
CREATE INDEX `property_location_idx` ON `property` (`latitude`,`longitude`);--> statement-breakpoint
CREATE INDEX `property_status_area_idx` ON `property` (`status`,`area`);--> statement-breakpoint
CREATE INDEX `property_type_bedrooms_idx` ON `property` (`type`,`bedrooms`);--> statement-breakpoint
CREATE INDEX `property_price_range_idx` ON `property` (`price`,`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `property_slug_unique_idx` ON `property` (`slug`);--> statement-breakpoint
CREATE TABLE `property_contact` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL,
	`label` text,
	`is_preferred` integer DEFAULT false,
	`is_verified` integer DEFAULT false,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `property_contact_property_idx` ON `property_contact` (`property_id`);--> statement-breakpoint
CREATE INDEX `property_contact_type_idx` ON `property_contact` (`type`);--> statement-breakpoint
CREATE TABLE `property_image` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`url` text NOT NULL,
	`thumbnail_url` text NOT NULL,
	`medium_url` text,
	`alt_text` text,
	`caption` text,
	`is_primary` integer DEFAULT false,
	`order` integer DEFAULT 0 NOT NULL,
	`width` integer,
	`height` integer,
	`file_size` integer,
	`format` text,
	`cloudflare_id` text,
	`r2_key` text,
	`uploaded_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `property_image_property_idx` ON `property_image` (`property_id`);--> statement-breakpoint
CREATE INDEX `property_image_order_idx` ON `property_image` (`property_id`,`order`);--> statement-breakpoint
CREATE INDEX `property_image_primary_idx` ON `property_image` (`property_id`,`is_primary`);--> statement-breakpoint
CREATE UNIQUE INDEX `property_image_unique_primary_idx` ON `property_image` (`property_id`) WHERE "property_image"."is_primary" = 1;--> statement-breakpoint
CREATE TABLE `property_search` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`query` text NOT NULL,
	`filters` text,
	`results_count` integer DEFAULT 0,
	`searched_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `property_search_user_idx` ON `property_search` (`user_id`);--> statement-breakpoint
CREATE INDEX `property_search_query_idx` ON `property_search` (`query`);--> statement-breakpoint
CREATE INDEX `property_search_searched_at_idx` ON `property_search` (`searched_at`);--> statement-breakpoint
CREATE TABLE `property_view` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`visitor_id` text,
	`ip_address` text,
	`user_agent` text,
	`referrer` text,
	`viewed_at` integer DEFAULT (unixepoch()) NOT NULL,
	`duration` integer,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `property_view_property_idx` ON `property_view` (`property_id`);--> statement-breakpoint
CREATE INDEX `property_view_viewed_at_idx` ON `property_view` (`viewed_at`);--> statement-breakpoint
CREATE INDEX `property_view_visitor_idx` ON `property_view` (`visitor_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`idToken` text,
	`password` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "userId", "accountId", "providerId", "accessToken", "refreshToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "idToken", "password", "createdAt", "updatedAt") SELECT "id", "userId", "accountId", "providerId", "accessToken", "refreshToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "idToken", "password", "createdAt", "updatedAt" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`impersonatedBy` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "userId", "token", "expiresAt", "ipAddress", "userAgent", "impersonatedBy", "createdAt", "updatedAt") SELECT "id", "userId", "token", "expiresAt", "ipAddress", "userAgent", "impersonatedBy", "createdAt", "updatedAt" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE TABLE `__new_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_verification`("id", "identifier", "value", "expiresAt", "createdAt", "updatedAt") SELECT "id", "identifier", "value", "expiresAt", "createdAt", "updatedAt" FROM `verification`;--> statement-breakpoint
DROP TABLE `verification`;--> statement-breakpoint
ALTER TABLE `__new_verification` RENAME TO `verification`;