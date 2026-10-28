-- MaxxCity Mart website enquiries.
--
-- The website writes these tables from the server only, using the Supabase
-- secret (service-role) key. Row-level security is enabled with NO policies,
-- and table privileges are revoked from the public roles, so visitors using
-- the anon/publishable key can neither read nor write any enquiry.
-- View and manage submissions in the Supabase dashboard (Table Editor).

create type public.enquiry_status as enum ('new', 'in_review', 'contacted', 'approved', 'declined', 'closed');

create table public.franchise_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  submission_id uuid not null unique,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text,
  city text not null,
  state text not null,
  preferred_location text not null,
  property_status text not null,
  experience text,
  investment_readiness text not null,
  additional_info text,
  consent boolean not null,
  internal_notes text
);

create table public.product_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  submission_id uuid not null unique,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  product_name text,
  product_url text,
  description text,
  variant text,
  quantity integer not null check (quantity between 1 and 1000),
  price_range text,
  branch text not null,
  preferred_city text,
  name text not null,
  phone text not null,
  email text,
  notes text,
  consent boolean not null,
  image_path text,
  image_original_name text,
  internal_notes text
);

create table public.manufacturer_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  submission_id uuid not null unique,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_person text not null,
  phone text not null,
  email text not null,
  location text not null,
  categories text[] not null,
  product_description text not null,
  website_url text,
  moq text,
  capacity text,
  additional_info text,
  consent boolean not null,
  catalogue_path text,
  catalogue_original_name text,
  internal_notes text
);

create table public.retailer_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  submission_id uuid not null unique,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  business_name text not null,
  contact_person text not null,
  phone text not null,
  email text,
  location text not null,
  business_type text not null,
  categories text not null,
  proposal text not null,
  comments text,
  consent boolean not null,
  internal_notes text
);

create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  submission_id uuid not null unique,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  topic text not null,
  message text not null,
  consent boolean not null,
  internal_notes text
);

create table public.location_interest (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  submission_id uuid not null unique,
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  city text not null,
  state text not null,
  note text,
  consent boolean not null,
  internal_notes text
);

create index on public.franchise_enquiries (created_at desc);
create index on public.product_requests (created_at desc);
create index on public.manufacturer_enquiries (created_at desc);
create index on public.retailer_enquiries (created_at desc);
create index on public.contact_enquiries (created_at desc);
create index on public.location_interest (created_at desc);

-- Lock everything down for public roles.
do $$
declare t text;
begin
  foreach t in array array[
    'franchise_enquiries', 'product_requests', 'manufacturer_enquiries',
    'retailer_enquiries', 'contact_enquiries', 'location_interest'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- Private bucket for product photos and supplier catalogues.
-- Images are re-encoded to JPEG by the server before upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('enquiry-uploads', 'enquiry-uploads', false, 4194304, array['image/jpeg', 'application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
-- No storage.objects policies are created for this bucket, so only the
-- server (secret key) can upload, and files are viewed via short-lived signed URLs.
