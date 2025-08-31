-- Add sample books after admin user has logged in and profile is created
-- Run this AFTER you've logged in to the app with your admin email
-- This ensures your user profile exists in the database

DO $$
DECLARE
    admin_user_id uuid;
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
    
    -- Get admin user ID by email
    SELECT id INTO admin_user_id FROM public.profiles WHERE email = 'f20240225@dubai.bits-pilani.ac.in';
    
    -- Check if admin user exists
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user not found! Please log in to the app first with f20240225@dubai.bits-pilani.ac.in';
    END IF;
    
    -- Insert real textbooks from curriculum
    INSERT INTO public.books (
        seller_id, category_id, title, author, edition, course_code, 
        condition, description, listing_type, starting_price, buy_now_price,
        auction_end_time, images
    ) VALUES
        -- Biology Textbook
        (
            admin_user_id, biology_cat_id,
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
        
        -- Chemistry Textbooks
        (
            admin_user_id, chemistry_cat_id,
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
        
        (
            admin_user_id, chemistry_cat_id,
            'Concise Inorganic Chemistry',
            'J. D. Lee',
            '5th Edition',
            'CHEM F101',
            'like_new',
            'Comprehensive inorganic chemistry reference. Blackwell Science, Oxford, 1996. Excellent condition.',
            'both',
            500.00,
            750.00,
            NOW() + INTERVAL '6 days',
            ARRAY['/placeholder.svg']
        ),
        
        (
            admin_user_id, chemistry_cat_id,
            'Organic Chemistry',
            'T. W. Graham Solomons, Craig B. Fryhle and Snyder Scott A.',
            'Global Edition',
            'CHEM F101',
            'new',
            'Brand new organic chemistry textbook. John Wiley & Sons Reprint 2017. Still in original packaging.',
            'both',
            1000.00,
            1400.00,
            NOW() + INTERVAL '10 days',
            ARRAY['/placeholder.svg']
        ),
        
        -- Mathematics Textbooks
        (
            admin_user_id, mathematics_cat_id,
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
        
        (
            admin_user_id, mathematics_cat_id,
            'Elementary Linear Algebra with Supplemental Applications',
            'H. Anton and Chris Rorres',
            '11ed',
            'MATH F102',
            'used',
            'Linear algebra textbook for Linear Algebra and Complex Variables. John Wiley & Sons, 2017. Good condition with student notes.',
            'auction',
            700.00,
            NULL,
            NOW() + INTERVAL '4 days',
            ARRAY['/placeholder.svg']
        ),
        
        (
            admin_user_id, mathematics_cat_id,
            'A First Course in Complex Analysis with Applications',
            'Dennis G. Zill and Patrick D. Shanahan',
            '2nd Ed.',
            'MATH F102',
            'like_new',
            'Complex analysis textbook. Jones & Bartlett Learning, 2013. Excellent condition.',
            'both',
            650.00,
            950.00,
            NOW() + INTERVAL '9 days',
            ARRAY['/placeholder.svg']
        ),
        
        -- Physics Textbook
        (
            admin_user_id, physics_cat_id,
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
        ),
        
        -- Engineering Textbooks
        (
            admin_user_id, engineering_cat_id,
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
        
        (
            admin_user_id, engineering_cat_id,
            'Prototyping and Model Making for Product Design',
            'Hallgrimsson, B',
            '2nd Ed.',
            'BITS F103',
            'new',
            'Product design and prototyping guide. Laurence King Publishing, 2019. Brand new condition.',
            'both',
            750.00,
            1100.00,
            NOW() + INTERVAL '15 days',
            ARRAY['/placeholder.svg']
        );
        
    RAISE NOTICE 'Successfully added 10 sample books from BITS Dubai curriculum!';
    RAISE NOTICE 'Books listed by admin user: % (f20240225@dubai.bits-pilani.ac.in)', admin_user_id;
    
END $$;
