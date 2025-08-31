-- Simple script to add sample books to production
-- This script uses a more flexible approach to handle user profiles

-- First ensure categories exist
INSERT INTO public.categories (name, code, description) VALUES
  ('Biology', 'BIO', 'Biology and Life Sciences textbooks'),
  ('Chemistry', 'CHEM', 'Chemistry textbooks and reference materials'),
  ('Mathematics', 'MATH', 'Mathematics and Calculus textbooks'),
  ('Physics', 'PHY', 'Physics and Physical Sciences textbooks'),
  ('Engineering', 'ENG', 'Engineering Design and Technical textbooks')
ON CONFLICT (code) DO NOTHING;

-- Add sample books using the first available user profile
DO $$
DECLARE
    seller_user_id uuid;
    biology_cat_id uuid;
    chemistry_cat_id uuid;
    mathematics_cat_id uuid;
    physics_cat_id uuid;
    engineering_cat_id uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO biology_cat_id FROM public.categories WHERE name = 'Biology';
    SELECT id INTO chemistry_cat_id FROM public.categories WHERE name = 'Chemistry';
    SELECT id INTO mathematics_cat_id FROM public.categories WHERE name = 'Mathematics';
    SELECT id INTO physics_cat_id FROM public.categories WHERE name = 'Physics';
    SELECT id INTO engineering_cat_id FROM public.categories WHERE name = 'Engineering';
    
    -- Get any existing user profile (preferably admin email, but any will work)
    SELECT id INTO seller_user_id FROM public.profiles 
    WHERE email = 'f20240225@dubai.bits-pilani.ac.in'
    LIMIT 1;
    
    -- If admin not found, use any existing profile
    IF seller_user_id IS NULL THEN
        SELECT id INTO seller_user_id FROM public.profiles LIMIT 1;
    END IF;
    
    -- If still no profiles, skip book creation and just set up categories
    IF seller_user_id IS NULL THEN
        RAISE NOTICE 'No user profiles found. Categories are ready.';
        RAISE NOTICE 'Log in to the app first, then run this script again to add sample books.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Using seller profile: %', seller_user_id;
    
    -- Clear any existing sample books to avoid duplicates
    DELETE FROM public.books WHERE title IN (
        'Campbell Essential Biology with Physiology',
        'Thomas Calculus',
        'Elements of Physical Chemistry',
        'Organic Chemistry',
        'Vibrations and Waves: The MIT Introductory'
    );
    
    -- Insert real textbooks from curriculum
    INSERT INTO public.books (
        seller_id, category_id, title, author, edition, course_code, 
        condition, description, listing_type, starting_price, buy_now_price,
        auction_end_time, images
    ) VALUES
        -- Biology Textbook
        (
            seller_user_id, biology_cat_id,
            'Campbell Essential Biology with Physiology',
            'Simon, E.J. et. al.',
            '5th edition',
            'BIO F101',
            'like_new',
            'Essential biology textbook for Introduction to Biological Sciences. Comprehensive coverage of biology fundamentals with physiology. Published by Pearson India, 2016.',
            'both',
            800.00,
            1200.00,
            NOW() + INTERVAL '7 days',
            ARRAY['/placeholder.svg']
        ),
        
        -- Mathematics Textbook
        (
            seller_user_id, mathematics_cat_id,
            'Thomas Calculus',
            'Weir, Maurice D. and Others',
            '15th ed.',
            'MATH F101',
            'like_new',
            'Comprehensive calculus textbook for Multivariable Calculus. Pearson Education, 2024. Minimal wear and highlighting.',
            'both',
            900.00,
            1300.00,
            NOW() + INTERVAL '8 days',
            ARRAY['/placeholder.svg']
        ),
        
        -- Chemistry Textbook
        (
            seller_user_id, chemistry_cat_id,
            'Elements of Physical Chemistry',
            'Atkins, P.W. and Julio de Paula',
            'International Edition',
            'CHEM F101',
            'used',
            'Physical chemistry textbook for Fundamentals of Chemistry. Oxford University Press, 2017. Good condition with some highlighting.',
            'auction',
            600.00,
            NULL,
            NOW() + INTERVAL '5 days',
            ARRAY['/placeholder.svg']
        ),
        
        -- Engineering Textbook
        (
            seller_user_id, engineering_cat_id,
            'Engineering Drawing and Design',
            'David A. Madsen, David P. Madsen',
            '6th Ed',
            'BITS F103',
            'like_new',
            'Engineering design and prototyping textbook. Cengage Learning, 2016. Excellent condition with minimal use.',
            'both',
            850.00,
            1250.00,
            NOW() + INTERVAL '12 days',
            ARRAY['/placeholder.svg']
        ),
        
        -- Physics Textbook
        (
            seller_user_id, physics_cat_id,
            'Vibrations and Waves: The MIT Introductory',
            'French, Anthony P',
            '1st Edition',
            'PHY F101',
            'used',
            'Introductory physics textbook for Oscillation and Waves. CBS, 2003. Shows wear but content is intact.',
            'auction',
            400.00,
            NULL,
            NOW() + INTERVAL '3 days',
            ARRAY['/placeholder.svg']
        );
        
    RAISE NOTICE 'Successfully added 5 sample books from BITS Dubai curriculum!';
    RAISE NOTICE 'Books listed by user: %', seller_user_id;
    RAISE NOTICE 'Visit https://bitsbid.vercel.app/books to see them!';
    
END $$;
