CREATE TABLE "visitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"meeting_place" text NOT NULL,
	"meeting_date" timestamp DEFAULT now() NOT NULL,
	"serial_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "visitors_serial_number_unique" UNIQUE("serial_number")
);
