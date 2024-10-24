ALTER TABLE "genres" DROP CONSTRAINT "genres_tmdb_id_unique";--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "tmdb_id" DROP NOT NULL;