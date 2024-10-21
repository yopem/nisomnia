ALTER TABLE "genres" ADD COLUMN "tmdb_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "production_companies" ADD COLUMN "tmdb_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "genres" ADD CONSTRAINT "genres_tmdb_id_unique" UNIQUE("tmdb_id");--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_imdb_id_unique" UNIQUE("imdb_id");--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_tmdb_id_unique" UNIQUE("tmdb_id");--> statement-breakpoint
ALTER TABLE "production_companies" ADD CONSTRAINT "production_companies_tmdb_id_unique" UNIQUE("tmdb_id");