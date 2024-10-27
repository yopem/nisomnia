CREATE TYPE "public"."media_type" AS ENUM('image', 'audio', 'video', 'document', 'other');--> statement-breakpoint
ALTER TABLE "medias" ADD COLUMN "type" "media_type" DEFAULT 'image' NOT NULL;