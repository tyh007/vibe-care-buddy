-- Add new customization columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hair_color text DEFAULT 'brown',
ADD COLUMN IF NOT EXISTS outfit text DEFAULT 'dress_beige',
ADD COLUMN IF NOT EXISTS accessory text DEFAULT 'none';

-- Clear existing shop items and inventory (cascade will handle foreign keys)
TRUNCATE TABLE public.shop_items CASCADE;

-- Insert new pixel art themed items
INSERT INTO public.shop_items (name, description, price, icon, category) VALUES
-- Hair colors
('Brown Hair', 'Classic brown locks', 0, 'brown', 'hair'),
('Black Hair', 'Sleek black hair', 30, 'black', 'hair'),
('Blonde Hair', 'Golden blonde waves', 40, 'blonde', 'hair'),
('Pink Hair', 'Cute pink hair', 50, 'pink', 'hair'),
('Blue Hair', 'Cool blue hair', 50, 'blue', 'hair'),
('Purple Hair', 'Mystical purple hair', 60, 'purple', 'hair'),

-- Accessories
('Cat Friend', 'A cute cat companion', 80, 'cat', 'accessory'),
('Bunny Ears', 'Adorable bunny ears', 70, 'bunny', 'accessory'),
('Flower Crown', 'Pretty flower crown', 60, 'flower', 'accessory'),
('Bow', 'Cute hair bow', 40, 'bow', 'accessory'),
('Star Clip', 'Sparkly star clip', 50, 'star', 'accessory'),

-- Outfits
('Beige Dress', 'Classic beige dress', 0, 'dress_beige', 'outfit'),
('Pink Dress', 'Lovely pink dress', 100, 'dress_pink', 'outfit'),
('Blue Dress', 'Elegant blue dress', 100, 'dress_blue', 'outfit'),
('School Uniform', 'Cute school uniform', 120, 'uniform', 'outfit'),
('Casual Tee', 'Comfy casual outfit', 80, 'casual', 'outfit');