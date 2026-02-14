
-- Fix 1: Create a public inventory view that only exposes stock status, not exact quantities
CREATE VIEW public.public_inventory AS
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

-- Restrict the base inventory table to authenticated users only
DROP POLICY "Anyone can view inventory" ON public.inventory;

CREATE POLICY "Authenticated users can view inventory"
ON public.inventory FOR SELECT
TO authenticated
USING (true);
