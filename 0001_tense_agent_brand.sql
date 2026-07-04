CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`lessonDate` timestamp NOT NULL,
	`platform` varchar(50) NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memberUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`email` varchar(320),
	`fullName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memberUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `memberUsers_username_unique` UNIQUE(`username`)
);
