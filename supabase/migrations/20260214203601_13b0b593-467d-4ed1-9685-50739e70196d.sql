
-- Fix 1: Add database constraints for review input validation
ALTER TABLE public.reviews ADD CONSTRAINT review_title_length CHECK (length(title) <= 100);
ALTER TABLE public.reviews ADD CONSTRAINT review_content_length CHECK (length(content) <= 1000);
ALTER TABLE public.reviews ADD CONSTRAINT review_rating_range CHECK (rating >= 1 AND rating <= 5);

-- Fix 2: Create a public view that hides user_id for public review display
CREATE VIEW public.public_reviews
WITH (security_invoker = on) AS
SELECT id, product_id, rating, title, content, author_name,
       helpful_count, created_at, updated_at, images
FROM public.reviews;

-- Update the SELECT policy: restrict base table to authenticated users only
DROP POLICY "Anyone can view reviews" ON public.reviews;

-- Authenticated users can view all reviews (needed for ownership checks)
CREATE POLICY "Authenticated users can view reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (true);

-- Anonymous users can view reviews through the public_reviews view
-- The view excludes user_id for privacy
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;
