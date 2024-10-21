DO $$ BEGIN
 CREATE TYPE "public"."media_types" AS ENUM('all', 'article', 'topic', 'genere', 'review', 'tutorial', 'movie', 'tv', 'game');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "medias" ADD COLUMN "type" "media_types" DEFAULT 'all' NOT NULL;