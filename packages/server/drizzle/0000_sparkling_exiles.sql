CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
