-- =====================================================
-- REFO APP - BASIC DATA IMPORT (No User Dependencies)
-- Run this first to populate categories, badges, and offers
-- =====================================================

-- =====================================================
-- 1. CATEGORIES
-- =====================================================
INSERT INTO public.categories (id, name, created_at) VALUES
('31b8bf61-0dd3-4072-9e7e-ecb145b32b2a', 'Gaming', '2025-11-10 16:17:18.26462+00'),
('99b046de-a515-4257-a4a5-322640fb9503', 'Finance', '2025-11-10 16:17:18.26462+00'),
('50ab32c2-007f-4dfa-82ef-eb462d7dd7da', 'Social', '2025-11-10 16:17:18.26462+00'),
('7ed37750-9774-4608-9d1f-ed8ba53e3343', 'Productivity', '2025-11-10 16:17:18.26462+00'),
('00a3baef-395e-46b0-8a04-beaf752f615f', 'Fashion', '2025-11-13 07:28:47.652988+00'),
('7b0d96a8-492e-49d0-a859-5c385d4333dd', 'E-commerce', '2025-11-13 07:28:55.961412+00')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. BADGES
-- =====================================================
INSERT INTO public.badges (id, name, description, icon, requirement_type, requirement_value, created_at) VALUES
('8a609099-3ddc-4504-bce3-9adc6fcd88b0', '3 Apps Completed', 'Complete 3 app tasks', 'Zap', 'tasks_completed', 3, '2025-11-16 12:06:10.505125+00'),
('3b861d0d-4fa8-4c45-9244-0c86811c382a', '5 Apps Verified', 'Complete 5 verified app tasks', 'Award', 'tasks_completed', 5, '2025-11-16 12:06:10.505125+00'),
('6ee28efb-5509-4c24-8393-231f4dd6bffd', '10 Apps Verified', 'Complete 10 verified app tasks', 'Crown', 'tasks_completed', 10, '2025-11-16 12:06:10.505125+00')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. OFFERS
-- =====================================================
INSERT INTO public.offers (id, title, description, category, reward, logo_url, play_store_url, instructions, status, is_public, created_at) VALUES
('f8875578-7a5a-4638-8e3d-d16abc86814f', 'Angel one', 'Brokerage', 'Finance', 150.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1mQhhKdHwF0cgBFjYAqkaUCESp7HiZJAzRw&s', 'https://angel-one.onelink.me/Wjgr/r86mkzfn', ARRAY['Make sure you dont have acoount previously. By agreeing Terms click on Continue and Download. Signup with your credentials and complete full process. After creating your account scessfully make sure to add proof in my task for verification. Once you verified yourself you get your money in wallet withing 24 to 48 hours.'], 'active', true, '2025-11-10 16:22:25.434326+00'),

('eca146fb-065b-4f72-b500-fe0663dbb45d', 'Phone PAy', 'Upi Application', 'Finance', 100.00, 'https://cdn.brandfetch.io/idcE0OdG8i/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'https://phon.pe/495p91b3', ARRAY['make sure you dont have any account previously Download the App by agreeing these terms  signup with your creadentials and fully complete the process After completion send us the screenshot in task section we verify that and the ammount adds up to your wallet. within 24 to 48 hours'], 'active', true, '2025-11-11 07:08:13.551234+00'),

('3fdc764e-a475-4f90-aca9-03741530bb50', 'Bhim', 'Upi app', 'Finance', 10.00, 'https://www.presentations.gov.in/wp-content/uploads/2020/06/BHIM_Preview.png', 'https://bhimnpci.page.link/app', ARRAY['Make Sure you are signing with fresh details Agree and continue terms then download and signup complete your full profile to get credited.'], 'active', true, '2025-11-11 07:29:40.205774+00'),

('952735d0-0ad6-413e-8978-fa70f216e26f', 'Ajio', 'Fashion', 'Fashion', 100.00, 'https://play-lh.googleusercontent.com/H_VVVQduGJEUfofF5YPszdTJVqqT46SoY-B9fIGxWHPCBH5gPGDtvbGgs3qebzNFdrS_', 'https://ajioapps.onelink.me/ybtf/nga3bgcd', ARRAY['Download and signup with new mobile number by accepting Terms and continue. you get upto 100rs signup bonus from Ajio app. The signup bonus you can use it in your first order.'], 'active', true, '2025-11-13 07:33:53.022639+00'),

('8eb761f3-3b82-4014-8490-c6749cd01dc6', 'Paytm', 'Upi', 'Finance', 25.00, '', 'https://p.paytm.me/xCTH/qj37vuoo', ARRAY['Download by reading and aceptingTerms. After download signup and link your upi and bank account use referall number 7406596912 make sure you add this and make you first payment of 10 rs to any merchent. After verifying you get cashback and rewards from us also.'], 'active', true, '2025-11-13 07:38:16.94788+00'),

('1b108127-419b-488f-af4d-10168ee8bcb8', 'G Pay', 'upi', 'Finance', 50.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtlxV3QKJnSf3nC49ff6qzKsM1MuUkxZpKeO9fmnDK8iCcVDIoew5nGp5zXTatRHOvX3ewojKlH8pmTh3b1_P09GU5AL3-ohmShsDuXog&s=10', 'https://g.co/payinvite/6z5l59w', ARRAY['Download and signup with new credentials by acepting the Terms. Make sure you dont have account or installed previously. link your bank account and upi and make first transaction to your friend of 100. Your reward Will be credited after verifying your proof.'], 'active', true, '2025-11-13 07:42:11.472883+00'),

('ce4d0a90-46a5-43f0-a4e1-4e9e74a55392', 'upstox', 'Brokerage', 'Finance', 100.00, 'https://play-lh.googleusercontent.com/XHAMg2tievEEjzTo91f7bCtBjjX6svmgDcPYFKCd3iHSqzG3wd3BajNZftOyjfMg4g', 'https://upstox.onelink.me/0H1s/4WA54J', ARRAY['Make sure you previously dont have any account or downloaded upstox.', 'Complete the signup process and make sure to add this referral 4WA54J while signup and continue. once account opened sucessfully from cdsl within 24 hours you get your rewards in wallet. Make sure to follow all the steps and procedure many do mistakes in between and never add any wrong miss information it may get reject do complete procedure.'], 'active', true, '2025-11-16 12:45:47.371008+00')
ON CONFLICT (id) DO NOTHING;
