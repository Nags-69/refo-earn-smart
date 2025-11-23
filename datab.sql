-- Complete Database Setup for Refo App
-- This file contains all tables, functions, triggers, RLS policies, and storage setup

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles Table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username text,
  email text,
  phone text,
  avatar_url text,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- User Roles Table
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user'::app_role,
  is_owner boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, role)
);

-- Wallet Table
CREATE TABLE public.wallet (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  total_balance numeric DEFAULT 0,
  pending_balance numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id)
);

-- Affiliate Links Table
CREATE TABLE public.affiliate_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  unique_code text NOT NULL,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id)
);

-- User Streaks Table
CREATE TABLE public.user_streaks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id)
);

-- Categories Table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Badges Table
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- User Badges Table
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Offers Table
CREATE TABLE public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  reward numeric NOT NULL,
  logo_url text,
  play_store_url text,
  instructions text[],
  status text DEFAULT 'active',
  is_public boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Tasks Table
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  offer_id uuid NOT NULL REFERENCES public.offers ON DELETE CASCADE,
  status text DEFAULT 'pending',
  proof_url text[],
  proof_uploaded_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Transactions Table
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Payout Requests Table
CREATE TABLE public.payout_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount numeric NOT NULL,
  payout_method text NOT NULL,
  upi_id text,
  bank_account_number text,
  bank_account_holder text,
  bank_ifsc_code text,
  status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  processed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Notifications Table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  task_id uuid,
  offer_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Chats Table
CREATE TABLE public.chats (
  chat_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  active_responder text NOT NULL DEFAULT 'AI',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (chat_id)
);

-- Chat Messages Table
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  sender text NOT NULL,
  message text NOT NULL,
  responder_mode text NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Task Cleanup Log Table
CREATE TABLE public.task_cleanup_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tasks_cleaned integer DEFAULT 0,
  last_cleanup_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND is_owner = true
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.wallet (user_id, total_balance, pending_balance)
  VALUES (NEW.id, 0, 0);
  
  INSERT INTO public.affiliate_links (user_id, unique_code)
  VALUES (NEW.id, SUBSTRING(NEW.id::TEXT FROM 1 FOR 8));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to handle chats updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_chats_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

-- Function to delete old task proofs
CREATE OR REPLACE FUNCTION public.delete_old_task_proofs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_task RECORD;
  proof_path text;
BEGIN
  FOR old_task IN 
    SELECT id, proof_url, user_id
    FROM public.tasks
    WHERE proof_uploaded_at < NOW() - INTERVAL '7 days'
    AND proof_url IS NOT NULL
  LOOP
    IF old_task.proof_url IS NOT NULL THEN
      FOREACH proof_path IN ARRAY old_task.proof_url
      LOOP
        DELETE FROM storage.objects
        WHERE bucket_id = 'task-proofs'
        AND name LIKE '%' || old_task.id || '%';
      END LOOP;
    END IF;
    
    UPDATE public.tasks
    SET proof_url = NULL,
        proof_uploaded_at = NULL
    WHERE id = old_task.id;
  END LOOP;
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for wallet updated_at
CREATE TRIGGER update_wallet_updated_at
  BEFORE UPDATE ON public.wallet
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for tasks updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for user_streaks updated_at
CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for chats last_updated
CREATE TRIGGER update_chats_last_updated
  BEFORE UPDATE ON public.chats
  FOR EACH ROW EXECUTE FUNCTION public.handle_chats_updated_at();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_cleanup_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - PROFILES
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - USER ROLES
-- ============================================================================

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles only"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND role = 'user' AND (is_owner = false OR is_owner IS NULL));

CREATE POLICY "Admins can delete user roles only"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin') AND role = 'user' AND (is_owner = false OR is_owner IS NULL));

CREATE POLICY "Owners can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.is_owner(auth.uid()))
  WITH CHECK (public.is_owner(auth.uid()));

-- ============================================================================
-- RLS POLICIES - WALLET
-- ============================================================================

CREATE POLICY "Users can view own wallet"
  ON public.wallet FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallets"
  ON public.wallet FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update wallets"
  ON public.wallet FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - AFFILIATE LINKS
-- ============================================================================

CREATE POLICY "Users can view own affiliate links"
  ON public.affiliate_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own affiliate links"
  ON public.affiliate_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all affiliate links"
  ON public.affiliate_links FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - USER STREAKS
-- ============================================================================

CREATE POLICY "Users can view own streak"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all streaks"
  ON public.user_streaks FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own streak"
  ON public.user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON public.user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - CATEGORIES
-- ============================================================================

CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - BADGES
-- ============================================================================

CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - USER BADGES
-- ============================================================================

CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all user badges"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "System can insert badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES - OFFERS
-- ============================================================================

CREATE POLICY "Public offers or admin access"
  ON public.offers FOR SELECT
  USING (is_public = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage offers"
  ON public.offers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - TASKS
-- ============================================================================

CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tasks"
  ON public.tasks FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tasks"
  ON public.tasks FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - TRANSACTIONS
-- ============================================================================

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - PAYOUT REQUESTS
-- ============================================================================

CREATE POLICY "Users can view own payout requests"
  ON public.payout_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payout requests"
  ON public.payout_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payout requests"
  ON public.payout_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payout requests"
  ON public.payout_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - NOTIFICATIONS
-- ============================================================================

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications"
  ON public.notifications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - CHATS
-- ============================================================================

CREATE POLICY "Users can view own chats"
  ON public.chats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chats"
  ON public.chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats"
  ON public.chats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all chats"
  ON public.chats FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all chats"
  ON public.chats FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - CHAT MESSAGES
-- ============================================================================

CREATE POLICY "Users can view own messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages"
  ON public.chat_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create any messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete messages"
  ON public.chat_messages FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RLS POLICIES - TASK CLEANUP LOG
-- ============================================================================

CREATE POLICY "Admins can view cleanup log"
  ON public.task_cleanup_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- STORAGE BUCKETS SETUP
-- ============================================================================

-- Create storage buckets (run these in Supabase Dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('task-proofs', 'task-proofs', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for task-proofs bucket
-- CREATE POLICY "Users can upload task proofs"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'task-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own task proofs"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'task-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Admins can view all task proofs"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'task-proofs' AND public.has_role(auth.uid(), 'admin'));

-- CREATE POLICY "Public can view task proofs"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'task-proofs');

-- Storage policies for avatars bucket
-- CREATE POLICY "Users can upload avatars"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can update own avatars"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Public can view avatars"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars');

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================

-- Insert default categories
-- INSERT INTO public.categories (name) VALUES 
--   ('Social Media'),
--   ('Shopping'),
--   ('Gaming'),
--   ('Finance'),
--   ('Entertainment');

-- Insert default badges
-- INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
--   ('First Steps', 'Complete your first task', '🎯', 'tasks_completed', 1),
--   ('Getting Started', 'Complete 5 tasks', '⭐', 'tasks_completed', 5),
--   ('On Fire', 'Maintain a 7-day streak', '🔥', 'streak_days', 7),
--   ('Money Maker', 'Earn ₹100', '💰', 'earnings_reached', 100);
