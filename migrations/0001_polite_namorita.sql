CREATE TABLE `request` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`seeker_id` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`type` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`contact_phone` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`seeker_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `inquiry_property_idx` ON `request` (`property_id`);--> statement-breakpoint
CREATE INDEX `inquiry_seeker_idx` ON `request` (`seeker_id`);--> statement-breakpoint
CREATE INDEX `inquiry_status_idx` ON `request` (`status`);