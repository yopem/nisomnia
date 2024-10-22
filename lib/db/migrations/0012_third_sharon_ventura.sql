DO $$ BEGIN
 CREATE TYPE "public"."feed_type" AS ENUM('website', 'tiktok', 'x', 'facebook');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_feed_topics" (
	"feed_id" text NOT NULL,
	"topic_id" text NOT NULL,
	CONSTRAINT "_feed_topics_feed_id_topic_id_pk" PRIMARY KEY("feed_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feeds" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"featured_image" text,
	"link" text,
	"type" "feed_type" DEFAULT 'website' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "feeds_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_feed_topics" ADD CONSTRAINT "_feed_topics_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_feed_topics" ADD CONSTRAINT "_feed_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
