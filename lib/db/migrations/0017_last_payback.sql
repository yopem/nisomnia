CREATE TYPE "public"."media_category" AS ENUM('article', 'feed', 'topic', 'genre', 'review', 'tutorial', 'movie', 'tv', 'game', 'production_company');--> statement-breakpoint
ALTER TABLE "medias" RENAME COLUMN "image_type" TO "file_type";--> statement-breakpoint
ALTER TABLE "medias" ADD COLUMN "category" "media_category" DEFAULT 'article' NOT NULL;