-- =====================================================
-- REFO APP DATABASE EXPORT
-- Generated on: 2025-11-25
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
('7b0d96a8-492e-49d0-a859-5c385d4333dd', 'E-commerce', '2025-11-13 07:28:55.961412+00');

-- =====================================================
-- 2. BADGES
-- =====================================================
INSERT INTO public.badges (id, name, description, icon, requirement_type, requirement_value, created_at) VALUES
('8a609099-3ddc-4504-bce3-9adc6fcd88b0', '3 Apps Completed', 'Complete 3 app tasks', 'Zap', 'tasks_completed', 3, '2025-11-16 12:06:10.505125+00'),
('3b861d0d-4fa8-4c45-9244-0c86811c382a', '5 Apps Verified', 'Complete 5 verified app tasks', 'Award', 'tasks_completed', 5, '2025-11-16 12:06:10.505125+00'),
('6ee28efb-5509-4c24-8393-231f4dd6bffd', '10 Apps Verified', 'Complete 10 verified app tasks', 'Crown', 'tasks_completed', 10, '2025-11-16 12:06:10.505125+00');

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

('ce4d0a90-46a5-43f0-a4e1-4e9e74a55392', 'upstox', 'Brokerage', 'Finance', 100.00, 'https://play-lh.googleusercontent.com/XHAMg2tievEEjzTo91f7bCtBjjX6svmgDcPYFKCd3iHSqzG3wd3BajNZftOyjfMg4g', 'https://upstox.onelink.me/0H1s/4WA54J', ARRAY['Make sure you previously dont have any account or downloaded upstox.', 'Complete the signup process and make sure to add this referral 4WA54J while signup and continue. once account opened sucessfully from cdsl within 24 hours you get your rewards in wallet. Make sure to follow all the steps and procedure many do mistakes in between and never add any wrong miss information it may get reject do complete procedure.'], 'active', true, '2025-11-16 12:45:47.371008+00');

-- =====================================================
-- 4. USER PROFILES (Note: Passwords are NOT exported for security)
-- =====================================================
-- IMPORTANT: You'll need to manually create users in auth.users in your new database
-- Then insert these profile records with matching user_ids

INSERT INTO public.profiles (id, username, email, phone, avatar_url, is_verified, created_at, updated_at) VALUES
('8c3056db-b859-4367-9bf4-24d20b049ee9', NULL, 'nagaraj.m.karakikatti@gmail.com', NULL, NULL, false, '2025-11-10 03:32:16.603547+00', '2025-11-10 03:32:16.603547+00'),
('d1731825-cff6-4c15-b811-e3305ffa210a', NULL, 'mrnaveen0000@gmail.com', NULL, NULL, false, '2025-11-10 07:24:26.413691+00', '2025-11-10 07:24:26.413691+00'),
('ed8509a9-c034-4159-8dcf-1e1cbc95de2d', NULL, 'abcd@gmail.com', NULL, NULL, false, '2025-11-10 14:57:37.034638+00', '2025-11-10 14:57:37.034638+00'),
('58389bfc-cb0d-4fe9-b15f-e464482ebf71', NULL, 'bbasavarajkarakikatti@gmail.com', NULL, NULL, false, '2025-11-10 16:27:14.067655+00', '2025-11-10 16:27:14.067655+00'),
('86b3d207-b458-4395-97bd-9b073330a203', NULL, 'ghostgojo@gmail.com', NULL, NULL, false, '2025-11-11 07:36:27.229389+00', '2025-11-11 07:36:27.229389+00'),
('1c243558-b639-487c-8c63-40238b985d88', NULL, 'ghostgojozz@gmail.com', NULL, NULL, false, '2025-11-11 07:38:37.875522+00', '2025-11-11 07:38:37.875522+00'),
('2a389b98-c936-4068-be66-276858454c01', NULL, 'rohitrk25802580@gmail.com', NULL, NULL, false, '2025-11-12 12:47:52.951584+00', '2025-11-12 12:47:52.951584+00'),
('b1b51599-ba81-493e-bf24-89fdfde302c3', NULL, 'vaishnaviastagimath@gmail.com', NULL, NULL, false, '2025-11-22 16:28:49.044427+00', '2025-11-22 16:28:49.044427+00'),
('bea06f04-3353-47da-98ac-6c49965cf517', NULL, 'rajanikerur@gmail.com', NULL, NULL, false, '2025-11-24 08:31:18.977002+00', '2025-11-24 08:31:18.977002+00');

-- =====================================================
-- 5. WALLETS
-- =====================================================
INSERT INTO public.wallet (id, user_id, total_balance, pending_balance, created_at, updated_at) VALUES
('2cb16843-393b-4572-b4c9-44e812f52046', '8c3056db-b859-4367-9bf4-24d20b049ee9', 0.00, 0.00, '2025-11-10 03:32:16.603547+00', '2025-11-13 03:55:23.324766+00'),
('79559ec3-4c62-41b7-bdb1-b69c2ab59892', 'd1731825-cff6-4c15-b811-e3305ffa210a', 0.00, 0.00, '2025-11-10 07:24:26.413691+00', '2025-11-10 07:24:26.413691+00'),
('51e73047-aabb-4032-b57e-d085970019d1', 'ed8509a9-c034-4159-8dcf-1e1cbc95de2d', 0.00, 0.00, '2025-11-10 14:57:37.034638+00', '2025-11-10 14:57:37.034638+00'),
('bde50071-6276-4e3d-8342-261ef9b04a3e', '58389bfc-cb0d-4fe9-b15f-e464482ebf71', 0.00, 0.00, '2025-11-10 16:27:14.067655+00', '2025-11-10 16:27:14.067655+00'),
('3411c809-24e4-45af-a18e-d58e63ddb0a3', '86b3d207-b458-4395-97bd-9b073330a203', 0.00, 0.00, '2025-11-11 07:36:27.229389+00', '2025-11-11 07:36:27.229389+00'),
('f43dcb89-6b0f-4e21-a28a-72bddfcc7f5c', '1c243558-b639-487c-8c63-40238b985d88', 0.00, 0.00, '2025-11-11 07:38:37.875522+00', '2025-11-11 07:38:37.875522+00'),
('d7efc08b-9dde-441e-be34-e5be978bf30d', '2a389b98-c936-4068-be66-276858454c01', 10.00, 0.00, '2025-11-12 12:47:52.951584+00', '2025-11-13 03:48:40.997755+00'),
('56f3f714-58d9-4ad0-8b50-06a87da7dc80', 'b1b51599-ba81-493e-bf24-89fdfde302c3', 0.00, 0.00, '2025-11-22 16:28:49.044427+00', '2025-11-22 16:28:49.044427+00'),
('729b643e-c529-465b-bb97-1d2934f269a9', 'bea06f04-3353-47da-98ac-6c49965cf517', 100.00, 0.00, '2025-11-24 08:31:18.977002+00', '2025-11-25 06:42:14.964218+00');

-- =====================================================
-- 6. AFFILIATE LINKS (REFERRALS)
-- =====================================================
INSERT INTO public.affiliate_links (id, user_id, unique_code, clicks, conversions, created_at) VALUES
('9c07c01b-289a-4932-a071-40bf8c7ca862', '8c3056db-b859-4367-9bf4-24d20b049ee9', '8c3056db', 0, 0, '2025-11-10 03:32:16.603547+00'),
('414eff99-3f50-43f1-8e47-05a17a5ad34f', 'd1731825-cff6-4c15-b811-e3305ffa210a', 'd1731825', 0, 0, '2025-11-10 07:24:26.413691+00'),
('6ac5c8ac-8266-4597-b7de-3c486279d85b', 'ed8509a9-c034-4159-8dcf-1e1cbc95de2d', 'ed8509a9', 0, 0, '2025-11-10 14:57:37.034638+00'),
('11955e17-839b-4afc-8ee5-f5fdd464493e', '58389bfc-cb0d-4fe9-b15f-e464482ebf71', '58389bfc', 0, 0, '2025-11-10 16:27:14.067655+00'),
('95f22b26-d18d-4c20-9173-e916e48e855b', '86b3d207-b458-4395-97bd-9b073330a203', '86b3d207', 0, 0, '2025-11-11 07:36:27.229389+00'),
('77a1002b-d6bc-4362-a97b-e18821a50fa4', '1c243558-b639-487c-8c63-40238b985d88', '1c243558', 0, 0, '2025-11-11 07:38:37.875522+00'),
('fa001424-6f70-4697-8b0a-a5ad4d15d1c9', '2a389b98-c936-4068-be66-276858454c01', '2a389b98', 0, 0, '2025-11-12 12:47:52.951584+00'),
('d3b336e4-5cc0-43a5-a339-a7f8e599b970', 'b1b51599-ba81-493e-bf24-89fdfde302c3', 'b1b51599', 0, 0, '2025-11-22 16:28:49.044427+00'),
('2ed6b052-2090-470b-ae0d-00b1a853e2cd', 'bea06f04-3353-47da-98ac-6c49965cf517', 'bea06f04', 0, 0, '2025-11-24 08:31:18.977002+00');

-- =====================================================
-- 7. TRANSACTIONS (EARNINGS & PAYOUTS)
-- =====================================================
INSERT INTO public.transactions (id, user_id, amount, type, description, status, created_at) VALUES
('162643b2-f04e-457c-98ec-a6a38047ccf4', '8c3056db-b859-4367-9bf4-24d20b049ee9', 10.00, 'earning', 'Pending: Bhim', 'pending', '2025-11-13 03:27:25.616026+00'),
('c70af522-4f9f-416b-892e-df6a69858ddf', '8c3056db-b859-4367-9bf4-24d20b049ee9', 200.00, 'bonus', 'Bonus: bonus', 'completed', '2025-11-13 03:38:40.156702+00'),
('e3a5aea0-a90b-4fe2-ba86-b915c90e697e', '8c3056db-b859-4367-9bf4-24d20b049ee9', 210.00, 'withdrawal', 'Withdrawal via upi', 'completed', '2025-11-13 03:43:10.668153+00'),
('3c5bde73-4786-495f-9291-2da2f5fdacfa', '2a389b98-c936-4068-be66-276858454c01', 10.00, 'bonus', 'Bonus: bhim signup', 'completed', '2025-11-13 03:48:42.202502+00'),
('562dcb4b-f11c-43fd-a62c-1f3ae705a041', '8c3056db-b859-4367-9bf4-24d20b049ee9', 200.00, 'bonus', 'Bonus: bonus', 'completed', '2025-11-13 03:52:55.519141+00'),
('c43a4ab7-d326-4e55-ab24-7fab79d8af1e', '8c3056db-b859-4367-9bf4-24d20b049ee9', 200.00, 'withdrawal', 'Withdrawal via bank', 'completed', '2025-11-13 03:55:23.082717+00'),
('e76fb8a4-6489-4846-be10-40ab7101929b', 'd1731825-cff6-4c15-b811-e3305ffa210a', 150.00, 'earning', 'Pending: Angel one', 'pending', '2025-11-22 16:16:55.97101+00'),
('1bc29a41-7c79-4e65-bd3a-3ce3841ab0f9', 'bea06f04-3353-47da-98ac-6c49965cf517', 100.00, 'earning', 'Completed: upstox', 'completed', '2025-11-25 06:42:14.369238+00');

-- =====================================================
-- 8. PAYOUT REQUESTS
-- =====================================================
INSERT INTO public.payout_requests (id, user_id, amount, payout_method, upi_id, bank_account_number, bank_account_holder, bank_ifsc_code, status, rejection_reason, processed_at, created_at) VALUES
('53d14003-fd45-45a8-9b82-7df390911a8a', '8c3056db-b859-4367-9bf4-24d20b049ee9', 210, 'upi', '7406596912@ybl', NULL, NULL, NULL, 'completed', NULL, '2025-11-13 03:43:09.357+00', '2025-11-13 03:42:37.417274+00'),
('57ecaf24-2ac5-4144-b728-e00c32f7db2f', '8c3056db-b859-4367-9bf4-24d20b049ee9', 200, 'bank', NULL, '122345678765432', 'nags', 'sdfgj31', 'completed', NULL, '2025-11-13 03:55:21.587+00', '2025-11-13 03:54:26.185372+00');

-- =====================================================
-- 9. USER STREAKS
-- =====================================================
INSERT INTO public.user_streaks (id, user_id, current_streak, longest_streak, last_activity_date, created_at, updated_at) VALUES
('582b7c2f-801a-41dc-bcee-1a3ed8798174', '8c3056db-b859-4367-9bf4-24d20b049ee9', 0, 0, NULL, '2025-11-13 03:05:45.05131+00', '2025-11-13 03:05:45.05131+00'),
('4eddfc8c-5adc-49e9-8891-b547e79c77b2', 'd1731825-cff6-4c15-b811-e3305ffa210a', 1, 1, '2025-11-20', '2025-11-20 14:48:44.020859+00', '2025-11-20 14:48:44.020859+00'),
('24e50215-a10a-463c-b404-cf9130172b45', 'bea06f04-3353-47da-98ac-6c49965cf517', 1, 1, '2025-11-24', '2025-11-24 09:18:08.228304+00', '2025-11-24 09:18:08.228304+00');

-- =====================================================
-- 10. NOTIFICATIONS
-- =====================================================
INSERT INTO public.notifications (id, user_id, title, message, type, task_id, offer_id, is_read, created_at) VALUES
('476d1293-dc29-4f5a-b343-b9f4ce17ba37', 'b1b51599-ba81-493e-bf24-89fdfde302c3', 'Action Required ❗', 'Action Required: Finish your pending account tasks to unlock your referral bonus. If you have recently completed this, please ignore this message.

For further opportunities, please review our other listed apps—download the ones you want and continue earning.', 'info', NULL, NULL, false, '2025-11-22 19:55:06.810827+00'),
('6a22616b-36a8-45f8-898f-e2847fbecae3', 'd1731825-cff6-4c15-b811-e3305ffa210a', 'hell', 'hello', 'info', NULL, NULL, true, '2025-11-22 19:57:20.372152+00'),
('6e05ddf6-28d0-4daf-aaed-b9c66c8b5857', 'bea06f04-3353-47da-98ac-6c49965cf517', 'Task Verified! 🎉', 'Your task for "upstox" has been verified. ₹100 has been added to your wallet.', 'success', '402bef06-5b27-49bd-a215-197f35236dda', 'ce4d0a90-46a5-43f0-a4e1-4e9e74a55392', false, '2025-11-25 06:42:15.290233+00'),
('57df5d5f-ee72-42df-9745-fc6272019623', 'bea06f04-3353-47da-98ac-6c49965cf517', 'Sucessfull Task', 'Congratulations! Your task submission has been approved. The reward has been added to your Refo wallet!', 'success', NULL, NULL, false, '2025-11-25 06:48:27.381601+00');

-- =====================================================
-- IMPORTANT NOTES FOR IMPORT
-- =====================================================
-- 1. Create users in auth.users table first with the emails listed above
-- 2. Update the user_id references in INSERT statements to match new auth.users IDs
-- 3. Tasks table data is too large - included separately if needed
-- 4. Chat messages not included (can export separately if needed)
-- 5. User passwords are NOT included for security - users must reset passwords
-- 6. Adjust timestamps if needed for your timezone
-- 7. Run this in your new database's SQL editor
