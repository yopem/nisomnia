ALTER TYPE "public"."media_types" RENAME TO "media_category";--> statement-breakpoint
ALTER TABLE "medias" RENAME COLUMN "type" TO "category";--> statement-breakpoint
ALTER TABLE "medias" ALTER COLUMN "category" SET DEFAULT 'article';