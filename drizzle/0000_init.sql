CREATE SCHEMA "apple_biz_card";
--> statement-breakpoint
CREATE TABLE "apple_biz_card"."default_places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_date" date NOT NULL,
	"place" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "default_places_event_date_unique" UNIQUE("event_date")
);
--> statement-breakpoint
CREATE TABLE "apple_biz_card"."visitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"meeting_place" text NOT NULL,
	"meeting_date" timestamp DEFAULT now() NOT NULL,
	"serial_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "visitors_serial_number_unique" UNIQUE("serial_number")
);
