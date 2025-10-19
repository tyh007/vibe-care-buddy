-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  coins INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_check_in DATE,
  total_check_ins INTEGER DEFAULT 0,
  avatar_hat TEXT DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shop_items table for purchasable items
CREATE TABLE public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'hat', 'badge', etc.
  price INTEGER NOT NULL,
  icon TEXT NOT NULL, -- emoji or icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_inventory table for purchased items
CREATE TABLE public.user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.shop_items(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Shop items policies (everyone can view)
CREATE POLICY "Anyone can view shop items"
  ON public.shop_items FOR SELECT
  USING (true);

-- User inventory policies
CREATE POLICY "Users can view their own inventory"
  ON public.user_inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own inventory"
  ON public.user_inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, coins)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    50 -- Starting coins as welcome bonus
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating profiles timestamp
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some starter shop items
INSERT INTO public.shop_items (name, description, category, price, icon) VALUES
  ('Party Hat', 'A festive party hat for celebrations', 'hat', 100, '🎉'),
  ('Crown', 'Feel like royalty with this golden crown', 'hat', 250, '👑'),
  ('Wizard Hat', 'For the wise and mystical', 'hat', 200, '🧙'),
  ('Cowboy Hat', 'Yeehaw! Perfect for adventures', 'hat', 150, '🤠'),
  ('Top Hat', 'Classy and sophisticated', 'hat', 180, '🎩'),
  ('Graduate Cap', 'Celebrate your achievements', 'hat', 120, '🎓'),
  ('Chef Hat', 'Master of the kitchen', 'hat', 140, '👨‍🍳'),
  ('Detective Hat', 'Solve the mystery of your moods', 'hat', 160, '🕵️'),
  ('Halo', 'An angelic touch', 'hat', 300, '😇'),
  ('Devil Horns', 'A mischievous mood', 'hat', 220, '😈');