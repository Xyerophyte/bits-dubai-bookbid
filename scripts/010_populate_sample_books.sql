-- Populate database with real textbooks from BITS Dubai curriculum
-- This script adds sample book listings based on actual course textbooks

-- First, ensure we have some categories (including required code field)
INSERT INTO public.categories (name, code, description) VALUES
  ('Biology', 'BIO', 'Biology and Life Sciences textbooks'),
  ('Chemistry', 'CHEM', 'Chemistry textbooks and reference materials'),
  ('Mathematics', 'MATH', 'Mathematics and Calculus textbooks'),
  ('Physics', 'PHY', 'Physics and Physical Sciences textbooks'),
  ('Engineering', 'ENG', 'Engineering Design and Technical textbooks')
ON CONFLICT (code) DO NOTHING;

-- This script only creates categories initially
-- Books will be created when you first log in and use the app
DO $$
DECLARE
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
    
    RAISE NOTICE 'Categories ready. Biology: %, Chemistry: %, Math: %, Physics: %, Engineering: %', 
        biology_cat_id, chemistry_cat_id, mathematics_cat_id, physics_cat_id, engineering_cat_id;
    
    RAISE NOTICE 'Setup complete! Categories are ready for book listings.';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Log in to your app with: f20240225@dubai.bits-pilani.ac.in';
    RAISE NOTICE '2. Your profile will be created automatically';
    RAISE NOTICE '3. You will have admin access to create book listings';
    RAISE NOTICE '4. Use the Sell Book feature to add real textbooks';
    
END $$;
