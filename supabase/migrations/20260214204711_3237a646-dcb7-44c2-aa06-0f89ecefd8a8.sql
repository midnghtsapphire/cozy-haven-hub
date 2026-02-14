
-- Fix security definer views by converting to security invoker
-- and adding restricted anon SELECT policies on base tables

-- Recreate public_reviews with security_invoker
DROP VIEW IF EXISTS public.public_reviews;
CREATE VIEW public.public_reviews
WITH (security_invoker = on) AS
SELECT id, product_id, rating, title, content, author_name,
       helpful_count, created_at, updated_at, images
FROM public.reviews;

GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;

-- Add anon SELECT policy on reviews (view will use invoker's permissions)
CREATE POLICY "Anon can view reviews"
ON public.reviews FOR SELECT
TO anon
USING (true);

-- Recreate public_inventory with security_invoker
DROP VIEW IF EXISTS public.public_inventory;
CREATE VIEW public.public_inventory
WITH (security_invoker = on) AS
SELECT product_id, variant_id,
       CASE 
         WHEN stock_quantity <= 0 THEN 'out_of_stock'
         WHEN stock_quantity <= low_stock_threshold THEN 'low_stock'
         ELSE 'in_stock'
       END AS stock_status,
       CASE WHEN stock_quantity <= 0 THEN true ELSE false END AS is_out_of_stock
FROM public.inventory;

GRANT SELECT ON public.public_inventory TO anon;
GRANT SELECT ON public.public_inventory TO authenticated;

-- Add anon SELECT policy on inventory
CREATE POLICY "Anon can view inventory"
ON public.inventory FOR SELECT
TO anon
USING (true);
