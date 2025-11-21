# 🎯 Refo - Referral & Offer Rewards Platform

A full-stack referral and rewards platform built with React, TypeScript, and Supabase. Users can complete tasks, earn rewards, and request payouts.

**🚀 Production-Ready | 📦 Complete with Migrations | 🔐 Security-First | 🎨 Beautiful UI**

### Clone → Deploy in 30 Minutes

This repository is **100% ready to deploy** to your own Supabase instance. All database tables, policies, functions, and triggers are included in migrations. Just follow the step-by-step setup guide below.

**What you get:**
- ✅ Complete database schema with 15 tables
- ✅ 30+ RLS policies for security
- ✅ 5 production edge functions
- ✅ Google OAuth + Email/Phone auth support
- ✅ Real-time notifications system
- ✅ AI chatbot integration (Gemini)
- ✅ Responsive UI with dark mode
- ✅ Admin panel with role management

## ✨ Features

### 👥 User Features
- 🔐 Secure authentication (Email, Phone OTP, Google OAuth)
- 📊 Personal dashboard with earnings tracking
- 🎯 Browse and complete offers
- 📸 Upload task completion proofs
- 💰 Request and track payouts (UPI/Bank)
- 🏆 Leaderboard with achievements
- 🔥 Streak tracking and badges
- 💬 AI-powered help chat (Gemini)
- 🔔 Real-time in-app notifications

### 👨‍💼 Admin Features
- 📈 Comprehensive admin dashboard
- 👤 User management with role control
- 📝 Offer creation and management
- ✅ Task verification and approval
- 💳 Payout processing
- 📊 Analytics and overview
- 🔧 System configuration
- 👑 Owner privileges for role management

### 🤖 What's Automated via Migrations

**Database Setup (Zero Manual SQL)**
- ✅ All 15 tables with proper structure
- ✅ Row-Level Security policies (30+ policies)
- ✅ Database functions (6 security-definer functions)
- ✅ Database triggers (auto-create profiles, wallets)
- ✅ Indexes for performance
- ✅ Foreign key relationships
- ✅ Enum types (app_role)

**Auto-Created on User Signup**
- ✅ Profile record in `profiles` table
- ✅ Wallet with $0 balance
- ✅ Unique affiliate link
- ✅ Default user role
- ✅ Streak tracking record

**Manual Setup Required**
- ⚠️ Storage buckets (5 min via SQL - Step 6)
- ⚠️ Auth providers (Email auto-enabled, others optional)
- ⚠️ Edge functions deployment (via CLI - Step 8)
- ⚠️ First admin account (via SQL - Step 9)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **AI**: Lovable AI Gateway (Gemini models)
- **Icons**: Lucide React

## 🚀 Complete Setup Guide

### Prerequisites
- Node.js 18+ or Bun installed
- Git
- Supabase account ([sign up free](https://supabase.com))
- Supabase CLI: `npm install -g supabase`

### Step 1: Clone Repository
```bash
git clone <YOUR_GIT_URL>
cd refo
npm install
# or: bun install
```

### Step 2: Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in details (name, password, region)
4. Wait ~2 minutes for project creation
5. **Important for Free Tier**: Settings → General → Pause settings → Set "Pause after" to **"Never"**

### Step 3: Get Credentials
**From Settings → API:**
- Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
- Copy **anon public** key (starts with `eyJ...`)
- Copy **Project Reference ID** (from URL or Settings → General)

### Step 4: Configure Environment
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Step 5: Run All Database Migrations

**Option A: Using Supabase CLI (Recommended)**
```bash
# Link to your project
supabase link --project-ref your-project-id

# Push all migrations to database
supabase db push
```

**Option B: Manual (Supabase Dashboard)**
1. Open SQL Editor in Supabase Dashboard
2. Run each file from `supabase/migrations/` folder in chronological order (sorted by filename timestamp)
3. Verify success: Check Database → Tables to see all tables created

### Step 6: Set Up Storage Buckets
Run in SQL Editor:
```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('task-proofs', 'task-proofs', true),
  ('avatars', 'avatars', true);

-- Task proofs policies
CREATE POLICY "Users upload proofs" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'task-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users view proofs" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'task-proofs');

CREATE POLICY "Admins delete proofs" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'task-proofs' AND has_role(auth.uid(), 'admin'::app_role));

-- Avatar policies
CREATE POLICY "Public avatars" ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users upload avatar" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update avatar" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete avatar" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 7: Configure Authentication

#### Email Auth (Required)
1. Go to **Authentication → Providers → Email**
2. Enable Email provider
3. **For Testing**: Disable "Confirm email" (allows instant signup)
4. **For Production**: Enable "Confirm email" and configure email templates

#### Phone Auth (Optional)
1. **Authentication → Providers → Phone**
2. Enable Phone provider
3. Select SMS provider (Twilio, MessageBird, Vonage)
4. Enter provider credentials

#### Google OAuth (Optional)
**Google Cloud Console Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project → **APIs & Services → Credentials**
3. Click **Create Credentials → OAuth Client ID**
4. Application type: **Web application**
5. **Authorized JavaScript origins**: `https://your-project-id.supabase.co`
6. **Authorized redirect URIs**: `https://your-project-id.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**

**OAuth Consent Screen:**
1. Go to **OAuth consent screen** in Google Cloud
2. Add **Authorized domain**: `supabase.co`
3. Add **Scopes**: `userinfo.email`, `userinfo.profile`, `openid`

**Supabase Configuration:**
1. **Authentication → Providers → Google**
2. Enable Google provider
3. Paste Client ID and Client Secret
4. Save

#### Site URL Configuration
1. **Authentication → URL Configuration**
2. **Site URL**: `http://localhost:5173` (dev) or `https://yourdomain.com` (prod)
3. **Redirect URLs**: Add `http://localhost:5173/**` and `https://yourdomain.com/**`

### Step 8: Deploy Edge Functions
```bash
# Deploy all functions
supabase functions deploy refo-chat
supabase functions deploy keep-alive
supabase functions deploy cleanup-old-proofs
supabase functions deploy send-task-notification
supabase functions deploy update-gamification

# Set secrets
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set LOVABLE_API_KEY=your_lovable_key
```

### Step 9: Create Admin Account
```bash
# Start development server
npm run dev
# or: bun dev

# Open http://localhost:5173 and sign up with your email
```

Then run in SQL Editor:
```sql
-- Grant admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT DO NOTHING;

-- Grant owner status (full permissions)
UPDATE public.user_roles
SET is_owner = true
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

Refresh app and go to `/admin` to access admin panel.

### Step 10: Start Development
```bash
npm run dev
# or: bun dev
```
App runs at **http://localhost:5173** ✨

---

## ✅ Post-Setup Verification Checklist

After completing setup, verify everything works:

### Database & Auth
- [ ] All tables created (check Database → Tables in Supabase)
- [ ] Can sign up new user (email/password)
- [ ] Can login with existing user
- [ ] Google OAuth working (if configured)
- [ ] Phone OTP working (if configured)
- [ ] Profile auto-created on signup
- [ ] Wallet auto-created with 0 balance

### Storage & Files
- [ ] Both storage buckets exist (`task-proofs`, `avatars`)
- [ ] Can upload avatar image
- [ ] Can upload task proof images
- [ ] Files accessible via public URLs

### Admin Access
- [ ] Admin account created via SQL
- [ ] Can access `/admin` route
- [ ] Admin panel loads without errors
- [ ] Can view all users in Users Management
- [ ] Can create new offers
- [ ] Can manage roles

### Core Features
- [ ] Dashboard displays user stats
- [ ] Can view available offers
- [ ] Can complete task and upload proof
- [ ] Notifications appear in bell icon
- [ ] Real-time notifications working
- [ ] Leaderboard shows users with earnings
- [ ] Streak tracking increments correctly
- [ ] AI chat responds (if GEMINI_API_KEY configured)

### Edge Functions
- [ ] `refo-chat` deployed and working
- [ ] `cleanup-old-proofs` deployed
- [ ] `keep-alive` deployed
- [ ] `send-task-notification` deployed
- [ ] `update-gamification` deployed
- [ ] Check logs: `supabase functions logs <function-name>`

### Production Readiness
- [ ] All secrets configured
- [ ] Email confirmation enabled (for production)
- [ ] Site URL updated for production domain
- [ ] Redirect URLs include production domain
- [ ] Environment variables set in hosting platform
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`

---

## 📦 Project Structure

```
refo-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── admin/          # Admin panel components
│   │   ├── AdminRoute.tsx  # Admin access control
│   │   └── ProtectedRoute.tsx # Auth protection
│   ├── pages/              # Route pages
│   ├── contexts/           # React contexts (Auth)
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase integration
│   ├── utils/              # Utility functions
│   ├── lib/                # Library configurations
│   └── index.css           # Global styles
├── supabase/
│   ├── functions/          # Edge functions
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── MIGRATION_GUIDE.md      # Detailed migration instructions
```

## 🔐 Security Features

✅ **All Critical Security Issues Fixed:**
- ✅ Admin access control with role-based permissions
- ✅ JWT authentication on all edge functions
- ✅ Comprehensive RLS policies on all tables
- ✅ Input validation on all forms (zod schemas)
- ✅ Secure password handling with leaked password protection
- ✅ Protected API endpoints
- ✅ File upload restrictions
- ✅ Private offers restricted to admins only

## 🗄️ Database Schema

### Tables Created by Migrations
- `profiles` - User profile information (avatar, username, email, phone)
- `wallet` - User balance tracking (total, pending)
- `user_roles` - Role-based access control (admin/user + owner flag)
- `offers` - Available tasks/offers with rewards
- `tasks` - User task submissions with proof uploads
- `transactions` - Financial transaction history
- `payout_requests` - Withdrawal requests (UPI/Bank)
- `badges` - Achievement badges configuration
- `user_badges` - User-earned badges
- `user_streaks` - Daily streak tracking
- `affiliate_links` - Referral tracking
- `chats` - AI chat sessions
- `chat_messages` - Chat history
- `notifications` - In-app notifications system
- `task_cleanup_log` - Task proof cleanup tracking

### Database Functions (Auto-created)
- `has_role(user_id, role)` - Check user role (security definer)
- `is_owner(user_id)` - Check owner status (security definer)
- `handle_new_user()` - Auto-create profile, wallet, affiliate link, default role
- `handle_updated_at()` - Auto-update timestamps
- `handle_chats_updated_at()` - Update chat last_updated timestamp
- `delete_old_task_proofs()` - Clean up task proofs older than 7 days

### Database Triggers (Auto-created)
- `on_auth_user_created` - Trigger `handle_new_user()` on signup
- `update_*_updated_at` - Auto-update timestamps on various tables

### RLS Policies (Comprehensive)
All tables have proper Row Level Security:
- ✅ Users can only access their own data
- ✅ Admins have elevated permissions
- ✅ Owners have full control
- ✅ Public data properly exposed (leaderboards, badges)

### Storage Buckets (Manual Setup Required)
- `task-proofs` - User task proof uploads (images/files)
- `avatars` - User profile pictures

**Note**: Storage buckets must be created manually (Step 6 in setup)

## 📝 Migration to Your Own Supabase

**See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for complete step-by-step instructions.**

### 🚀 Quick Migration Steps:

#### 1. Create New Supabase Project
```bash
# Visit https://supabase.com/dashboard
# Click "New Project"
# Note down: Project URL, Anon Key, Service Role Key
```

#### 2. Run Database Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run all migrations (in order)
supabase db push

# Or manually in SQL Editor, run files from supabase/migrations/ in order
```

#### 3. Set Up Storage Buckets
```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-proofs', 'task-proofs', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Set up storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'task-proofs' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'task-proofs' 
  AND auth.role() = 'authenticated' 
);
```

#### 4. Configure Authentication
```bash
# In Supabase Dashboard → Authentication → Providers
# Enable: Email, Phone (optional), Google OAuth (optional)
# Set up redirect URLs
```

#### 5. Deploy Edge Functions
```bash
# Deploy all edge functions
supabase functions deploy refo-chat
supabase functions deploy cleanup-old-proofs
supabase functions deploy keep-alive
supabase functions deploy update-gamification

# Set required secrets
supabase secrets set GEMINI_API_KEY=your_key_here
supabase secrets set LOVABLE_API_KEY=your_key_here
```

#### 6. Update Environment Variables
```env
# Update .env file
VITE_SUPABASE_URL=https://your-new-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-new-anon-key
VITE_SUPABASE_PROJECT_ID=your-new-project-id
```

#### 7. Create Owner Account
```bash
# Sign up through your app
# Then run in SQL Editor:
```
```sql
UPDATE public.user_roles
SET is_owner = true
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
) AND role = 'admin';
```

#### 8. Deploy Frontend
```bash
# Option A: Vercel
vercel --prod

# Option B: Netlify
netlify deploy --prod

# Option C: Manual
npm run build
# Upload dist/ folder to your server
```

### ✅ Verification Checklist
- [ ] All migrations ran successfully
- [ ] Storage buckets created and accessible
- [ ] Authentication working (test signup/login)
- [ ] Edge functions deployed and responding
- [ ] Admin account has owner status
- [ ] Can access `/admin` panel
- [ ] Can create offers and manage users
- [ ] Wallet transactions working
- [ ] File uploads working (task proofs)

### 🔄 Database Migration Files
All migration files are in `supabase/migrations/` directory. Run them in chronological order (filename timestamp order) for proper setup.

### 🚨 Important: Prevent Auto-Pause

**Supabase free tier projects pause after 7 days of inactivity!**

**Solutions:**
- **Upgrade to Pro** ($25/month) - Never pauses
- **Set up monitoring** - Use [UptimeRobot](https://uptimerobot.com/) (free) to ping every 5 min
- **Manual access** - Visit your app weekly
- **Supabase CLI** - Keep project linked: `supabase link --project-ref YOUR_ID`

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

⚠️ **Never commit `.env` to Git!** (already in `.gitignore`)

## 📊 Admin & Owner Setup

### Role Hierarchy
- **Owner**: Full control over all roles, can designate other owners and admins
- **Admin**: Can manage users, offers, tasks, payouts (cannot manage other admins)
- **User**: Regular app access

### Initial Setup Steps

After deployment, follow these steps to set up the first owner:

1. **Sign up** for an account through the app
2. **Open Supabase SQL Editor** and run:
```sql
-- Grant admin role and owner status to your account
UPDATE public.user_roles
SET is_owner = true
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
) AND role = 'admin';

-- If you don't have an admin role yet, run this first:
INSERT INTO public.user_roles (user_id, role, is_owner)
SELECT id, 'admin'::app_role, true
FROM auth.users
WHERE email = 'your-email@example.com';
```
3. **Refresh** the app and access `/admin`
4. **Navigate to** Admin Panel → Roles to manage other users

### Adding Additional Admins/Owners

Once you're set as owner:
- Go to Admin Panel → Roles Management
- Select a user and choose their role
- Owners can designate other users as owners

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```
Add environment variables in Vercel dashboard.

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```
Set build command: `npm run build`, publish directory: `dist`

### Option 3: Lovable Platform
Click **Publish** button in Lovable editor.

### Option 4: Manual/VPS
```bash
npm run build
# Upload `dist/` folder to your server
# Serve using nginx, Apache, or any static file server
```

## 🆘 Troubleshooting

### "Project paused after 7 days"
- **Fix**: Restore in Supabase dashboard → Settings → General → Restore
- **Prevent**: Upgrade to Pro or set up monitoring

### "Access denied to admin panel"
- Verify admin role exists in `user_roles` table
- Check `has_role()` function is working
- Clear browser cache and re-login

### "RLS policy violation"
- Ensure user is authenticated
- Check RLS policies allow the operation
- Verify `user_id` columns are set correctly

### "Edge function error"
- Check secrets: `supabase secrets list`
- View logs: `supabase functions logs refo-chat`
- Verify JWT verification is enabled

### "Storage upload failed"
- Check bucket exists and is public
- Verify RLS policies on `storage.objects`
- Check file size limits (5MB max)

## 🎨 Customization

### Styling
- **Colors**: Edit `src/index.css` (uses HSL color system)
- **Components**: Customize in `src/components/ui/`
- **Theme**: Modify design tokens in `tailwind.config.ts`

### Features
- **Add offers**: Admin panel → Offers → Create
- **Create badges**: Admin panel → Overview
- **Configure tasks**: Edit offer instructions

## 📚 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for your own projects!

## 🎯 Roadmap

- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Automated payout processing (payment gateway integration)
- [ ] Social media integrations
- [ ] Gamification enhancements (levels, quests)
- [ ] Email notifications
- [ ] Two-factor authentication

## 💬 Support

Need help?
- 📖 Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- 🐛 Open an issue on GitHub
- 📚 Review [Supabase documentation](https://supabase.com/docs)
- 💬 Join [Supabase Discord](https://discord.supabase.com)

---

## 📌 Important Notes

### Security
- ✅ All critical security issues have been resolved
- ✅ Admin authentication is properly secured
- ✅ RLS policies protect all sensitive data
- ✅ Input validation prevents injection attacks
- ✅ Edge functions require JWT authentication

### Maintenance
- 🔄 Database backups: Supabase auto-backup (Pro plan)
- 📊 Monitor usage in Supabase dashboard
- 🔒 Keep dependencies updated
- 🧪 Test before deploying to production

### Performance
- ⚡ Edge functions for fast backend operations
- 🎨 Optimized frontend with React 18
- 📦 Code splitting for faster loads
- 🖼️ Image optimization with storage CDN

---

Built with ❤️ using React, TypeScript, and Supabase

**⭐ Star this repo if you find it useful!**

## 🔗 Quick Links

- [Migration Guide](./MIGRATION_GUIDE.md) - Complete setup instructions
- [Lovable Project](https://lovable.dev/projects/aa32f486-0560-424a-ac9e-1b228e8b0020) - Edit in Lovable
- [Supabase Setup](https://supabase.com) - Create your database
- [Deploy Guide](https://docs.lovable.dev/features/custom-domain) - Custom domains
