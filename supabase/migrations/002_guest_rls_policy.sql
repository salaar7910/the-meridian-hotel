-- Allow authenticated users to view their own guest record by email
-- This is needed for the middleware to check admin role
CREATE POLICY "Users can view own guest record" ON guests
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Also allow service role to read all guest records (bypasses RLS anyway, but explicit)
-- Service role already bypasses RLS, so this is just for clarity
