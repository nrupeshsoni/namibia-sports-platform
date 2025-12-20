CREATE TABLE `namibia_sports_athletes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`federationId` int NOT NULL,
	`clubId` int,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`biography` text,
	`profilePhotoUrl` text,
	`dateOfBirth` timestamp,
	`gender` enum('male','female','other'),
	`nationality` varchar(100) DEFAULT 'Namibian',
	`achievements` text,
	`currentRanking` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_athletes_id` PRIMARY KEY(`id`),
	CONSTRAINT `namibia_sports_athletes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_clubs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`federationId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`logoUrl` text,
	`location` varchar(255),
	`region` varchar(100),
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`website` text,
	`establishedYear` int,
	`memberCount` int,
	`achievements` text,
	`facilities` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_clubs_id` PRIMARY KEY(`id`),
	CONSTRAINT `namibia_sports_clubs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_coaches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`federationId` int NOT NULL,
	`clubId` int,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`biography` text,
	`profilePhotoUrl` text,
	`certifications` text,
	`specialization` varchar(255),
	`yearsOfExperience` int,
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_coaches_id` PRIMARY KEY(`id`),
	CONSTRAINT `namibia_sports_coaches_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`federationId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`eventType` enum('competition','tournament','training','workshop','meeting','other') NOT NULL DEFAULT 'competition',
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`venue` varchar(255),
	`location` varchar(255),
	`region` varchar(100),
	`registrationDeadline` timestamp,
	`registrationUrl` text,
	`resultsUrl` text,
	`posterUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `namibia_sports_events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_federations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`logoUrl` text,
	`heroImageUrl` text,
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`website` text,
	`address` text,
	`presidentName` varchar(255),
	`presidentContact` varchar(50),
	`secretaryGeneralName` varchar(255),
	`secretaryGeneralContact` varchar(50),
	`establishedYear` int,
	`memberCount` int,
	`type` enum('federation','umbrella_body','ministry','commission') NOT NULL DEFAULT 'federation',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_federations_id` PRIMARY KEY(`id`),
	CONSTRAINT `namibia_sports_federations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_hp_programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`federationId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`programType` enum('talent_identification','training','development','elite') NOT NULL,
	`startDate` timestamp,
	`endDate` timestamp,
	`participants` json,
	`coaches` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_hp_programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`type` enum('image','video','document') NOT NULL DEFAULT 'image',
	`altText` varchar(255),
	`caption` text,
	`entityType` enum('federation','club','event','athlete','venue','coach') NOT NULL,
	`entityId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `namibia_sports_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`location` varchar(255),
	`region` varchar(100),
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`sportsOffered` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_schools_id` PRIMARY KEY(`id`),
	CONSTRAINT `namibia_sports_schools_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `namibia_sports_venues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255),
	`region` varchar(100),
	`address` text,
	`capacity` int,
	`sportsSupported` json,
	`facilities` text,
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`bookingUrl` text,
	`imageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `namibia_sports_venues_id` PRIMARY KEY(`id`),
	CONSTRAINT `namibia_sports_venues_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','federation_admin','club_manager') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `federationId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `clubId` int;