ALTER TABLE "medias" RENAME COLUMN "type" TO "image_type";--> statement-breakpoint
ALTER TABLE "production_companies" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "production_companies" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "production_companies" ADD COLUMN "meta_description" text;