
-- Fix: Recreate public_reviews view without security_invoker
-- so anon users can read reviews through the view (which excludes user_id)
-- while the base table remains restricted to authenticated users only
DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews AS
SELECT id, product_id, rating, title, content, author_name,
       helpful_count, created_at, updated_at, images
FROM public.reviews;

-- Re-grant access
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;
