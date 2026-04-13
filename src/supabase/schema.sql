-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.blogs (
  id bigint NOT NULL DEFAULT nextval('"Blogs_id_seq"'::regclass),
  user_id uuid NOT NULL,
  title text NOT NULL,
  image_url text,
  keywords text,
  body text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT blogs_pkey PRIMARY KEY (id),
  CONSTRAINT Blogs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.bulk_upload_logs (
  id bigint NOT NULL DEFAULT nextval('"Bulk_Upload_Logs_id_seq"'::regclass),
  broker_id uuid NOT NULL,
  file_url text NOT NULL,
  success_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bulk_upload_logs_pkey PRIMARY KEY (id),
  CONSTRAINT Bulk_Upload_Logs_broker_id_fkey FOREIGN KEY (broker_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.chat (
  id bigint NOT NULL DEFAULT nextval('"Chat_id_seq"'::regclass),
  listing_id uuid NOT NULL,
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  last_message_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chat_pkey PRIMARY KEY (id),
  CONSTRAINT Chat_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id),
  CONSTRAINT Chat_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id),
  CONSTRAINT Chat_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.favorites_listings (
  id bigint NOT NULL DEFAULT nextval('"Favorites_Listings_id_seq"'::regclass),
  user_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT favorites_listings_pkey PRIMARY KEY (id),
  CONSTRAINT Favorites_Listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT Favorites_Listings_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
);
CREATE TABLE public.listing_documents (
  id bigint NOT NULL DEFAULT nextval('"Listing_Documents_id_seq"'::regclass),
  listing_id uuid NOT NULL,
  file_url text NOT NULL,
  file_type character varying,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT listing_documents_pkey PRIMARY KEY (id),
  CONSTRAINT Listing_Documents_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id)
);
CREATE TABLE public.listings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  listing_id character varying UNIQUE,
  reference_id character varying,
  user_id uuid NOT NULL,
  title character varying NOT NULL,
  description text,
  keywords text,
  business_category character varying,
  currency character varying DEFAULT 'USD'::character varying,
  min_price integer,
  max_price integer,
  min_revenue integer,
  max_revenue integer,
  min_cashflow integer,
  max_cashflow integer,
  country character varying,
  state character varying,
  is_sba_approved boolean DEFAULT false,
  has_seller_financing boolean DEFAULT false,
  is_distressed boolean DEFAULT false,
  is_remote boolean DEFAULT false,
  status USER-DEFINED DEFAULT 'draft'::status_t,
  is_featured boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  ffe integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  image_url text,
  CONSTRAINT listings_pkey PRIMARY KEY (id),
  CONSTRAINT Listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.messages (
  id bigint NOT NULL DEFAULT nextval('"Messages_id_seq"'::regclass),
  chat_id bigint NOT NULL,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT Messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id),
  CONSTRAINT Messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  role USER-DEFINED DEFAULT 'buyer'::role_t,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  avatar_url text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT Profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);