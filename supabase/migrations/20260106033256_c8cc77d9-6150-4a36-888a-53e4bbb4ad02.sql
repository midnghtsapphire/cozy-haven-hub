-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true);

-- Allow authenticated users to upload review images
CREATE POLICY "Authenticated users can upload review images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'review-images' AND auth.uid() IS NOT NULL);

-- Allow public access to view review images
CREATE POLICY "Anyone can view review images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'review-images');

-- Allow users to delete their own review images
CREATE POLICY "Users can delete their own review images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'review-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add images column to reviews table
ALTER TABLE public.reviews ADD COLUMN images text[] DEFAULT '{}';