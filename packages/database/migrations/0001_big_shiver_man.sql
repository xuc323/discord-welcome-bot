ALTER TABLE "requests" DROP CONSTRAINT "requests_guid_guilds_guid_fk";
--> statement-breakpoint
ALTER TABLE "guilds" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "date" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "author" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "discriminator" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_guid_guilds_guid_fk" FOREIGN KEY ("guid") REFERENCES "guilds"("guid") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
