DO $$ BEGIN
 CREATE TYPE "public"."topic_type" AS ENUM('all', 'article', 'feed', 'review', 'tutorial', 'movie', 'tv', 'game');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "type" "topic_type" DEFAULT 'all' NOT NULL;