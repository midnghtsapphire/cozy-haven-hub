
-- Set file size limit on review-images bucket (5MB = 5242880 bytes)
UPDATE storage.buckets 
SET file_size_limit = 5242880 
WHERE id = 'review-images';

-- Update upload policy to enforce user folder structure and limit uploads
DROP POLICY IF EXISTS "Authenticated users can upload review images" ON storage.objects;

CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-images' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);
