-- Enable UUID extension for Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define custom ENUM types
CREATE TYPE role_t AS ENUM ('buyer', 'seller', 'broker', 'admin');
CREATE TYPE status_t AS ENUM ('available', 'loi', 'sold');

-- Profiles table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS "Profiles" (
    "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "full_name" VARCHAR(255),
    "role" role_t DEFAULT 'buyer',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE IF NOT EXISTS "Listings" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "listing_id" VARCHAR(255) UNIQUE,
    "reference_id" VARCHAR(255),
    "user_id" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "keywords" TEXT,
    "business_category" VARCHAR(255),
    "currency" VARCHAR(10) DEFAULT 'USD',
    "min_price" INTEGER,
    "max_price" INTEGER,
    "min_revenue" INTEGER,
    "max_revenue" INTEGER,
    "min_cashflow" INTEGER,
    "max_cashflow" INTEGER,
    "country" VARCHAR(255),
    "state" VARCHAR(255),
    "is_sba_approved" BOOLEAN DEFAULT false,
    "has_seller_financing" BOOLEAN DEFAULT false,
    "is_distressed" BOOLEAN DEFAULT false,
    "is_remote" BOOLEAN DEFAULT false,
    "status" status_t DEFAULT 'available',
    "is_featured" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,
    "ffe" INTEGER COMMENT 'Furniture, Fixtures & Equipment',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Listing Images table
CREATE TABLE IF NOT EXISTS "Listing_Images" (
    "id" BIGSERIAL PRIMARY KEY,
    "listing_id" UUID NOT NULL REFERENCES "Listings"("id") ON DELETE CASCADE,
    "image_url" VARCHAR(255) NOT NULL,
    "is_primary" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Listing Documents table
CREATE TABLE IF NOT EXISTS "Listing_Documents" (
    "id" BIGSERIAL PRIMARY KEY,
    "listing_id" UUID NOT NULL REFERENCES "Listings"("id") ON DELETE CASCADE,
    "file_url" TEXT NOT NULL,
    "file_type" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favorites Listings table
CREATE TABLE IF NOT EXISTS "Favorites_Listings" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "listing_id" UUID NOT NULL REFERENCES "Listings"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("user_id", "listing_id")
);

-- Chat table
CREATE TABLE IF NOT EXISTS "Chat" (
    "id" BIGSERIAL PRIMARY KEY,
    "listing_id" UUID NOT NULL REFERENCES "Listings"("id") ON DELETE CASCADE,
    "buyer_id" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "seller_id" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "last_message_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS "Messages" (
    "id" BIGSERIAL PRIMARY KEY,
    "chat_id" BIGINT NOT NULL REFERENCES "Chat"("id") ON DELETE CASCADE,
    "sender_id" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "message" TEXT NOT NULL,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bulk Upload Logs table
CREATE TABLE IF NOT EXISTS "Bulk_Upload_Logs" (
    "id" BIGSERIAL PRIMARY KEY,
    "broker_id" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "file_url" TEXT NOT NULL,
    "success_count" INTEGER DEFAULT 0,
    "failed_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table
CREATE TABLE IF NOT EXISTS "Blogs" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "Profiles"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "image_url" TEXT,
    "keywords" TEXT,
    "body" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_email ON "Profiles"("email");
CREATE INDEX idx_listings_user_id ON "Listings"("user_id");
CREATE INDEX idx_listings_status ON "Listings"("status");
CREATE INDEX idx_listings_category ON "Listings"("business_category");
CREATE INDEX idx_listing_images_listing ON "Listing_Images"("listing_id");
CREATE INDEX idx_listing_docs_listing ON "Listing_Documents"("listing_id");
CREATE INDEX idx_favorites_user ON "Favorites_Listings"("user_id");
CREATE INDEX idx_favorites_listing ON "Favorites_Listings"("listing_id");
CREATE INDEX idx_chat_listing ON "Chat"("listing_id");
CREATE INDEX idx_chat_buyer ON "Chat"("buyer_id");
CREATE INDEX idx_chat_seller ON "Chat"("seller_id");
CREATE INDEX idx_messages_chat ON "Messages"("chat_id");
CREATE INDEX idx_messages_sender ON "Messages"("sender_id");
CREATE INDEX idx_blogs_user ON "Blogs"("user_id");

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE "Profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing_Images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing_Documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorites_Listings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chat" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bulk_Upload_Logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Blogs" ENABLE ROW LEVEL SECURITY;
