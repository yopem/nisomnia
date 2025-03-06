CREATE TYPE "public"."ad_position" AS ENUM('home_below_header', 'article_below_header', 'topic_below_header', 'single_article_above_content', 'single_article_middle_content', 'single_article_below_content', 'single_article_pop_up', 'article_below_header_amp', 'single_article_above_content_amp', 'single_article_middle_content_amp', 'single_article_below_content_amp');--> statement-breakpoint
CREATE TYPE "public"."ad_type" AS ENUM('plain_ad', 'adsense');--> statement-breakpoint
CREATE TYPE "public"."article_visibility" AS ENUM('public', 'member');--> statement-breakpoint
CREATE TYPE "public"."feed_type" AS ENUM('website', 'tiktok', 'x', 'facebook');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('id', 'en');--> statement-breakpoint
CREATE TYPE "public"."media_category" AS ENUM('all', 'article', 'feed', 'topic', 'genre', 'review', 'tutorial', 'movie', 'tv', 'game', 'production_company');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'audio', 'video', 'document', 'other');--> statement-breakpoint
CREATE TYPE "public"."overview_type" AS ENUM('game', 'movie', 'tv');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('published', 'draft', 'rejected', 'in_review');--> statement-breakpoint
CREATE TYPE "public"."topic_visibility" AS ENUM('public', 'internal');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'member', 'author', 'admin');--> statement-breakpoint
CREATE TABLE "ads" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"position" "ad_position" DEFAULT 'home_below_header' NOT NULL,
	"type" "ad_type" DEFAULT 'plain_ad' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ads_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "_article_authors" (
	"article_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "_article_authors_article_id_user_id_pk" PRIMARY KEY("article_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "_article_editors" (
	"article_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "_article_editors_article_id_user_id_pk" PRIMARY KEY("article_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "_article_topics" (
	"article_id" text NOT NULL,
	"topic_id" text NOT NULL,
	CONSTRAINT "_article_topics_article_id_topic_id_pk" PRIMARY KEY("article_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "article_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"visibility" "article_visibility" DEFAULT 'public' NOT NULL,
	"article_translation_id" text NOT NULL,
	"featured_image" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "_feed_topics" (
	"feed_id" text NOT NULL,
	"topic_id" text NOT NULL,
	CONSTRAINT "_feed_topics_feed_id_topic_id_pk" PRIMARY KEY("feed_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "feeds" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"featured_image" text,
	"link" text,
	"type" "feed_type" DEFAULT 'website' NOT NULL,
	"owner" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "feeds_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" text PRIMARY KEY NOT NULL,
	"tmdb_id" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"featured_image" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "genres_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"file_type" text NOT NULL,
	"category" "media_category" DEFAULT 'article' NOT NULL,
	"type" "media_type" DEFAULT 'image' NOT NULL,
	"description" text,
	"author_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "medias_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "_movie_genres" (
	"movie_id" text NOT NULL,
	"genre_id" text NOT NULL,
	CONSTRAINT "_movie_genres_movie_id_genre_id_pk" PRIMARY KEY("movie_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "_movie_overviews" (
	"movie_id" text NOT NULL,
	"overview_id" text NOT NULL,
	CONSTRAINT "_movie_overviews_movie_id_overview_id_pk" PRIMARY KEY("movie_id","overview_id")
);
--> statement-breakpoint
CREATE TABLE "_movie_production_companies" (
	"movie_id" text NOT NULL,
	"production_company_id" text NOT NULL,
	CONSTRAINT "_movie_production_companies_movie_id_production_company_id_pk" PRIMARY KEY("movie_id","production_company_id")
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" text PRIMARY KEY NOT NULL,
	"imdb_id" text,
	"tmdb_id" text NOT NULL,
	"title" text NOT NULL,
	"original_title" text,
	"tagline" text,
	"slug" text NOT NULL,
	"airing_status" text,
	"origin_country" text,
	"original_language" text NOT NULL,
	"spoken_languages" text,
	"release_date" text,
	"revenue" integer,
	"runtime" integer,
	"budget" integer,
	"homepage" text,
	"backdrop" text,
	"poster" text,
	"meta_title" text,
	"meta_description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "movies_tmdb_id_unique" UNIQUE("tmdb_id"),
	CONSTRAINT "movies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "overviews" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" "overview_type" DEFAULT 'game' NOT NULL,
	"language" "language" DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_companies" (
	"id" text PRIMARY KEY NOT NULL,
	"tmdb_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"origin_country" text,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "production_companies_tmdb_id_unique" UNIQUE("tmdb_id"),
	CONSTRAINT "production_companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "topic_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"visibility" "topic_visibility" DEFAULT 'public' NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"topic_translation_id" text NOT NULL,
	"featured_image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"provider" text NOT NULL,
	"provider_account_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "accounts_provider_account_id_unique" UNIQUE("provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text,
	"username" text NOT NULL,
	"image" text,
	"phone_number" text,
	"about" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "_article_authors" ADD CONSTRAINT "_article_authors_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_article_authors" ADD CONSTRAINT "_article_authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_article_editors" ADD CONSTRAINT "_article_editors_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_article_editors" ADD CONSTRAINT "_article_editors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_article_topics" ADD CONSTRAINT "_article_topics_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_article_topics" ADD CONSTRAINT "_article_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_article_translation_id_article_translations_id_fk" FOREIGN KEY ("article_translation_id") REFERENCES "public"."article_translations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_feed_topics" ADD CONSTRAINT "_feed_topics_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."feeds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_feed_topics" ADD CONSTRAINT "_feed_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_movie_genres" ADD CONSTRAINT "_movie_genres_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_movie_genres" ADD CONSTRAINT "_movie_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_movie_overviews" ADD CONSTRAINT "_movie_overviews_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_movie_overviews" ADD CONSTRAINT "_movie_overviews_overview_id_overviews_id_fk" FOREIGN KEY ("overview_id") REFERENCES "public"."overviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_movie_production_companies" ADD CONSTRAINT "_movie_production_companies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_movie_production_companies" ADD CONSTRAINT "_movie_production_companies_production_company_id_production_companies_id_fk" FOREIGN KEY ("production_company_id") REFERENCES "public"."production_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_topic_translation_id_topic_translations_id_fk" FOREIGN KEY ("topic_translation_id") REFERENCES "public"."topic_translations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;