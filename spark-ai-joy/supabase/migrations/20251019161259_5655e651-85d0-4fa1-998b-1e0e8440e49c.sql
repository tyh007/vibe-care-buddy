-- Add new customization columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hairstyle text DEFAULT 'long',
ADD COLUMN IF NOT EXISTS eye_color text DEFAULT 'brown_eyes',
ADD COLUMN IF NOT EXISTS top text DEFAULT 'basic_shirt',
ADD COLUMN IF NOT EXISTS bottom text DEFAULT 'basic_pants';

-- Remove old avatar_hat column if it exists since we're not using it anymore
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_hat;

-- Clear existing shop items and add comprehensive new items
TRUNCATE TABLE public.shop_items CASCADE;

INSERT INTO public.shop_items (name, description, price, icon, category) VALUES
-- Hairstyles (different styles, not just colors)
('Long Hair', 'Classic long flowing hair', 0, 'long', 'hairstyle'),
('Short Bob', 'Cute short bob cut', 40, 'bob', 'hairstyle'),
('Ponytail', 'High ponytail style', 50, 'ponytail', 'hairstyle'),
('Pigtails', 'Adorable twin tails', 60, 'pigtails', 'hairstyle'),
('Messy Bun', 'Casual messy bun', 45, 'bun', 'hairstyle'),
('Pixie Cut', 'Short pixie style', 55, 'pixie', 'hairstyle'),

-- Hair colors (now separate from style)
('Brown Hair Color', 'Natural brown', 0, 'brown', 'hair'),
('Black Hair Color', 'Deep black', 30, 'black', 'hair'),
('Blonde Hair Color', 'Golden blonde', 40, 'blonde', 'hair'),
('Pink Hair Color', 'Pastel pink', 50, 'pink', 'hair'),
('Blue Hair Color', 'Ocean blue', 50, 'blue', 'hair'),
('Purple Hair Color', 'Lavender purple', 60, 'purple', 'hair'),
('Green Hair Color', 'Mint green', 55, 'green', 'hair'),
('Red Hair Color', 'Fiery red', 45, 'red', 'hair'),

-- Eye colors
('Brown Eyes', 'Warm brown eyes', 0, 'brown_eyes', 'eye_color'),
('Blue Eyes', 'Sky blue eyes', 35, 'blue_eyes', 'eye_color'),
('Green Eyes', 'Emerald green eyes', 40, 'green_eyes', 'eye_color'),
('Gray Eyes', 'Cool gray eyes', 35, 'gray_eyes', 'eye_color'),
('Hazel Eyes', 'Warm hazel eyes', 45, 'hazel_eyes', 'eye_color'),
('Violet Eyes', 'Mystical violet', 60, 'violet_eyes', 'eye_color'),

-- Tops
('Basic Shirt', 'Simple everyday shirt', 0, 'basic_shirt', 'top'),
('Striped Tee', 'Classic striped shirt', 50, 'striped_tee', 'top'),
('Hoodie', 'Comfy hoodie', 80, 'hoodie', 'top'),
('Tank Top', 'Casual tank', 45, 'tank', 'top'),
('Sweater', 'Cozy sweater', 70, 'sweater', 'top'),
('Crop Top', 'Trendy crop top', 60, 'crop', 'top'),
('Overalls', 'Cute overalls', 90, 'overalls', 'top'),
('Blazer', 'Professional blazer', 100, 'blazer', 'top'),

-- Bottoms
('Basic Pants', 'Simple pants', 0, 'basic_pants', 'bottom'),
('Jeans', 'Classic blue jeans', 50, 'jeans', 'bottom'),
('Skirt', 'Cute skirt', 55, 'skirt', 'bottom'),
('Shorts', 'Casual shorts', 40, 'shorts', 'bottom'),
('Leggings', 'Comfy leggings', 45, 'leggings', 'bottom'),
('Dress', 'Pretty dress', 85, 'dress', 'bottom'),

-- Accessories
('Cat Friend', 'Cute cat companion', 80, 'cat', 'accessory'),
('Bunny Ears', 'Adorable bunny ears', 70, 'bunny', 'accessory'),
('Flower Crown', 'Pretty flower crown', 60, 'flower', 'accessory'),
('Hair Bow', 'Cute hair bow', 40, 'bow', 'accessory'),
('Star Clip', 'Sparkly star clip', 50, 'star', 'accessory'),
('Wings', 'Magical fairy wings', 120, 'wings', 'accessory'),
('Halo', 'Angelic halo', 100, 'halo', 'accessory'),
('Devil Horns', 'Playful devil horns', 85, 'horns', 'accessory'),
('Headphones', 'Cool headphones', 75, 'headphones', 'accessory'),
('Glasses', 'Stylish glasses', 50, 'glasses', 'accessory'),
('Sunglasses', 'Cool sunglasses', 65, 'sunglasses', 'accessory'),
('Witch Hat', 'Magical witch hat', 95, 'witch_hat', 'accessory'),
('Crown', 'Royal crown', 150, 'crown', 'accessory'),
('Bandana', 'Cool bandana', 45, 'bandana', 'accessory');