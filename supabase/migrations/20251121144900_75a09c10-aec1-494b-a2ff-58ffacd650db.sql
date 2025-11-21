-- Add is_owner column to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS is_owner boolean DEFAULT false;

-- Create index for faster owner lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_owner 
ON public.user_roles(user_id) WHERE is_owner = true;

-- Create function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND is_owner = true
  )
$$;

-- Drop all existing policies on user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Recreate policies with owner restrictions
-- Owners have full control over all roles
CREATE POLICY "Owners can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_owner(auth.uid()))
WITH CHECK (public.is_owner(auth.uid()));

-- Admins can view all roles but cannot modify admin or owner roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can only insert 'user' roles
CREATE POLICY "Admins can insert user roles only"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND role = 'user'::app_role
  AND (is_owner = false OR is_owner IS NULL)
);

-- Admins can only delete 'user' roles
CREATE POLICY "Admins can delete user roles only"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND role = 'user'::app_role
  AND (is_owner = false OR is_owner IS NULL)
);

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);