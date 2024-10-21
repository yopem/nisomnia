CREATE TABLE IF NOT EXISTS "genre_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"id" text PRIMARY KEY NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"genre_translation_id" text NOT NULL,
	"featured_image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "genres_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_movie_genres" (
	"movie_id" text NOT NULL,
	"genre_id" text NOT NULL,
	CONSTRAINT "_movie_genres_movie_id_genre_id_pk" PRIMARY KEY("movie_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_movie_production_companies" (
	"movie_id" text NOT NULL,
	"production_company_id" text NOT NULL,
	CONSTRAINT "_movie_production_companies_movie_id_production_company_id_pk" PRIMARY KEY("movie_id","production_company_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies" (
	"id" text PRIMARY KEY NOT NULL,
	"imdb_id" text NOT NULL,
	"tmdb_id" text NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"title" text NOT NULL,
	"other_title" text,
	"tagline" text,
	"slug" text NOT NULL,
	"overview" text NOT NULL,
	"status" text,
	"origin_country" text,
	"original_language" text NOT NULL,
	"spoken_languages" text,
	"release_date" timestamp,
	"budget" text,
	"revenue" integer,
	"runtime" integer,
	"backdrop" text,
	"poster" text,
	"movie_translation_id" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "movies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "production_companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"origin_country" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "production_companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genres" ADD CONSTRAINT "genres_genre_translation_id_genre_translations_id_fk" FOREIGN KEY ("genre_translation_id") REFERENCES "public"."genre_translations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_movie_genres" ADD CONSTRAINT "_movie_genres_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_movie_genres" ADD CONSTRAINT "_movie_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_movie_production_companies" ADD CONSTRAINT "_movie_production_companies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_movie_production_companies" ADD CONSTRAINT "_movie_production_companies_production_company_id_production_companies_id_fk" FOREIGN KEY ("production_company_id") REFERENCES "public"."production_companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movies" ADD CONSTRAINT "movies_movie_translation_id_movie_translations_id_fk" FOREIGN KEY ("movie_translation_id") REFERENCES "public"."movie_translations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
