import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PixelAvatar } from "@/components/PixelAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

interface InventoryItem extends ShopItem {
  isEquipped: boolean;
}

const categoryIcons = {
  hairstyle: "💇",
  hair: "🎨",
  eye_color: "👁️",
  top: "👕",
  bottom: "👖",
  accessory: "✨"
};

const itemDisplayIcons: Record<string, any> = {
  // Hair colors
  brown: { color: "#8B5A2B", shade: "#6B4423" },
  black: { color: "#2d2d2d", shade: "#1a1a1a" },
  blonde: { color: "#FFD700", shade: "#D4A017" },
  pink: { color: "#FF69B4", shade: "#FF1493" },
  blue: { color: "#4169E1", shade: "#1E90FF" },
  purple: { color: "#9370DB", shade: "#8B008B" },
  green: { color: "#32CD32", shade: "#228B22" },
  red: { color: "#DC143C", shade: "#8B0000" },
  
  // Hairstyles
  long: { emoji: "👩‍🦰", label: "Long" },
  bob: { emoji: "💇‍♀️", label: "Bob" },
  ponytail: { emoji: "🎀", label: "Ponytail" },
  pigtails: { emoji: "👧", label: "Pigtails" },
  bun: { emoji: "🍩", label: "Bun" },
  pixie: { emoji: "✂️", label: "Pixie" },
  
  // Eye colors
  brown_eyes: { color: "#6B4423", emoji: "👁️" },
  blue_eyes: { color: "#4169E1", emoji: "👁️" },
  green_eyes: { color: "#228B22", emoji: "👁️" },
  gray_eyes: { color: "#808080", emoji: "👁️" },
  hazel_eyes: { color: "#8B7355", emoji: "👁️" },
  violet_eyes: { color: "#8B008B", emoji: "👁️" },
  
  // Tops
  basic_shirt: { color: "#4A90E2", emoji: "👕" },
  striped_tee: { color: "#FF6B6B", emoji: "👕" },
  hoodie: { color: "#A569BD", emoji: "🧥" },
  tank: { color: "#58D68D", emoji: "🎽" },
  sweater: { color: "#F39C12", emoji: "🧶" },
  crop: { color: "#FF69B4", emoji: "👚" },
  overalls: { color: "#5DADE2", emoji: "👖" },
  blazer: { color: "#2C3E50", emoji: "🧥" },
  
  // Bottoms
  basic_pants: { color: "#2C5F2D", emoji: "👖" },
  jeans: { color: "#4682B4", emoji: "👖" },
  skirt: { color: "#FF69B4", emoji: "👗" },
  shorts: { color: "#3498DB", emoji: "🩳" },
  leggings: { color: "#34495E", emoji: "👖" },
  dress: { color: "#E91E63", emoji: "👗" },
  
  // Accessories
  cat: { emoji: "🐱", color: "#FF8C00" },
  bunny: { emoji: "🐰", color: "#FFB6C1" },
  flower: { emoji: "🌸", color: "#FF69B4" },
  bow: { emoji: "🎀", color: "#FF1493" },
  star: { emoji: "⭐", color: "#FFD700" },
  wings: { emoji: "🧚", color: "#E1BEE7" },
  halo: { emoji: "😇", color: "#FFD700" },
  horns: { emoji: "😈", color: "#8B0000" },
  headphones: { emoji: "🎧", color: "#000000" },
  glasses: { emoji: "👓", color: "#5D4037" },
  sunglasses: { emoji: "🕶️", color: "#212121" },
  witch_hat: { emoji: "🧙", color: "#6A1B9A" },
  crown: { emoji: "👑", color: "#FFD700" },
  bandana: { emoji: "🧣", color: "#E53935" }
};

const ItemIcon = ({ icon, category }: { icon: string; category: string }) => {
  const displayInfo = itemDisplayIcons[icon];
  
  if (!displayInfo) {
    return <div className="text-6xl">✨</div>;
  }
  
  // Hairstyles - show emoji with label
  if (category === 'hairstyle' && 'label' in displayInfo) {
    return (
      <div className="relative w-20 h-20 flex flex-col items-center justify-center gap-1 bg-amber-100 dark:bg-amber-900 rounded-lg border-2 border-amber-900/30">
        <span className="text-4xl">{displayInfo.emoji}</span>
        <span className="text-xs font-bold text-amber-900 dark:text-amber-100">{displayInfo.label}</span>
      </div>
    );
  }
  
  // Hair colors - gradient swatch
  if (category === 'hair' && 'color' in displayInfo && !('emoji' in displayInfo)) {
    return (
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-lg border-4 border-gray-800/20" style={{ imageRendering: 'pixelated' }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${displayInfo.color} 0%, ${displayInfo.shade} 100%)` }} />
        <div className="absolute top-2 left-2 right-2 h-8 rounded opacity-50" style={{ backgroundColor: displayInfo.color }} />
      </div>
    );
  }
  
  // Eye colors - colored eye icon
  if (category === 'eye_color' && 'color' in displayInfo) {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
        <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center" style={{ borderColor: displayInfo.color }}>
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: displayInfo.color }} />
        </div>
      </div>
    );
  }
  
  // Tops, Bottoms, Accessories - emoji with background
  if ('emoji' in displayInfo) {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center rounded-lg" style={{ backgroundColor: displayInfo.color + '20' }}>
        <span className="text-5xl" style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.2))' }}>
          {displayInfo.emoji}
        </span>
      </div>
    );
  }
  
  return <div className="text-6xl">✨</div>;
};

const Shop = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [currentEquipped, setCurrentEquipped] = useState({
    hairstyle: "long",
    hair: "brown",
    eye_color: "brown_eyes",
    top: "basic_shirt",
    bottom: "basic_pants",
    accessory: "none"
  });
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: shopItems } = await supabase
      .from("shop_items")
      .select("*")
      .order("category", { ascending: true })
      .order("price", { ascending: true });

    if (shopItems) setItems(shopItems);

    const { data: profile } = await supabase
      .from("profiles")
      .select("coins, hair_color, hairstyle, eye_color, top, bottom, accessory")
      .eq("id", user.id)
      .single();

    if (profile) {
      setCoins(profile.coins || 0);
      setCurrentEquipped({
        hairstyle: profile.hairstyle || "long",
        hair: profile.hair_color || "brown",
        eye_color: profile.eye_color || "brown_eyes",
        top: profile.top || "basic_shirt",
        bottom: profile.bottom || "basic_pants",
        accessory: profile.accessory || "none"
      });
    }

    const { data: userInventory } = await supabase
      .from("user_inventory")
      .select("item_id")
      .eq("user_id", user.id);

    if (userInventory) {
      const inventoryIds = userInventory.map(item => item.item_id);
      setInventory(inventoryIds);
      
      if (shopItems) {
        const ownedItems = shopItems
          .filter(item => inventoryIds.includes(item.id))
          .map(item => ({
            ...item,
            isEquipped: item.icon === currentEquipped[item.category as keyof typeof currentEquipped]
          }));
        setInventoryItems(ownedItems);
      }
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (coins < item.price) {
      toast({
        title: "Not enough coins! 💰",
        description: `You need ${item.price - coins} more coins.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(item.id);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ coins: coins - item.price })
        .eq("id", user.id);

      if (updateError) throw updateError;

      const { error: inventoryError } = await supabase
        .from("user_inventory")
        .insert({ user_id: user.id, item_id: item.id });

      if (inventoryError) throw inventoryError;

      toast({
        title: "Purchase successful! 🎉",
        description: `You bought ${item.name}! Head to Dress Up to wear it.`,
      });

      loadShopData();
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleEquip = async (item: InventoryItem) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      let updateField: string;
      let newValue: string;
      
      // Map category to database field
      switch (item.category) {
        case "hairstyle":
          updateField = "hairstyle";
          break;
        case "hair":
          updateField = "hair_color";
          break;
        case "eye_color":
          updateField = "eye_color";
          break;
        case "top":
          updateField = "top";
          break;
        case "bottom":
          updateField = "bottom";
          break;
        case "accessory":
          updateField = "accessory";
          break;
        default:
          updateField = item.category;
      }
      
      // Toggle equip/unequip
      if (item.isEquipped) {
        // Get default value for each category
        const defaults: Record<string, string> = {
          hairstyle: "long",
          hair_color: "brown",
          eye_color: "brown_eyes",
          top: "basic_shirt",
          bottom: "basic_pants",
          accessory: "none"
        };
        newValue = defaults[updateField] || "none";
      } else {
        newValue = item.icon;
      }
      
      const { error } = await supabase
        .from("profiles")
        .update({ [updateField]: newValue })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: item.isEquipped ? "Item removed! 👋" : "Item equipped! ✨",
        description: item.isEquipped ? `Removed ${item.name}` : `Now wearing ${item.name}`,
      });

      await loadShopData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShopItem[]>);

  const groupedInventory = inventoryItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-green-950 dark:to-blue-950">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-5xl font-bold mb-2 animate-fade-in text-amber-900 dark:text-amber-100" 
              style={{ 
                fontFamily: 'monospace',
                textShadow: '3px 3px 0px rgba(139, 69, 19, 0.3)',
                imageRendering: 'pixelated'
              }}
            >
              🛒 Village Shop
            </h1>
            <p className="text-lg text-amber-800 dark:text-amber-200 animate-fade-in font-semibold">
              Customize your character! 
            </p>
          </div>
          <div 
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 dark:from-yellow-600 dark:via-amber-600 dark:to-orange-600 rounded-lg shadow-xl border-4 border-amber-900/30"
            style={{
              boxShadow: '0 4px 0 rgba(139, 69, 19, 0.3), 0 8px 12px rgba(0,0,0,0.2)',
              imageRendering: 'pixelated'
            }}
          >
            <span className="text-3xl drop-shadow-md">🪙</span>
            <span className="text-3xl font-bold text-amber-900 dark:text-amber-100" style={{ fontFamily: 'monospace' }}>{coins}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 sticky top-8 h-fit">
            <PixelAvatar size="large" showCoins={false} />
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="shop" className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 mb-6 bg-amber-100 dark:bg-amber-900 border-4 border-amber-900/30 h-14"
                style={{ boxShadow: '0 4px 0 rgba(139, 69, 19, 0.2)' }}
              >
                <TabsTrigger 
                  value="shop" 
                  className="text-lg font-bold data-[state=active]:bg-amber-300 dark:data-[state=active]:bg-amber-700"
                  style={{ fontFamily: 'monospace' }}
                >
                  🛍️ Shop
                </TabsTrigger>
                <TabsTrigger 
                  value="dressup" 
                  className="text-lg font-bold data-[state=active]:bg-amber-300 dark:data-[state=active]:bg-amber-700"
                  style={{ fontFamily: 'monospace' }}
                >
                  ✨ Wardrobe
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="shop" className="space-y-6">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <div key={category}>
                    <div 
                      className="flex items-center gap-3 mb-4 px-4 py-2 bg-amber-100 dark:bg-amber-900 rounded-lg border-2 border-amber-900/30"
                      style={{ boxShadow: '0 2px 0 rgba(139, 69, 19, 0.2)' }}
                    >
                      <span className="text-3xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                      <h2 className="text-2xl font-bold capitalize text-amber-900 dark:text-amber-100" style={{ fontFamily: 'monospace' }}>
                        {category}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categoryItems.map((item) => {
                        const owned = inventory.includes(item.id);
                        return (
                          <Card 
                            key={item.id} 
                            className={`p-6 flex flex-col hover:shadow-2xl transition-all border-4 ${
                              owned 
                                ? 'border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950' 
                                : 'border-amber-900/20 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-950'
                            }`}
                            style={{ 
                              boxShadow: owned 
                                ? '0 4px 0 rgba(22, 163, 74, 0.3), 0 8px 12px rgba(0,0,0,0.2)' 
                                : '0 4px 0 rgba(139, 69, 19, 0.2), 0 8px 12px rgba(0,0,0,0.1)',
                              imageRendering: 'pixelated'
                            }}
                          >
                            <div className="mb-4 flex justify-center">
                              <ItemIcon icon={item.icon} category={item.category} />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-amber-900 dark:text-amber-100" style={{ fontFamily: 'monospace' }}>
                              {item.name}
                            </h3>
                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-4 flex-1">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 px-3 py-1 bg-amber-200 dark:bg-amber-800 rounded-md border-2 border-amber-900/30">
                                <span className="text-2xl">🪙</span>
                                <span className="font-bold text-xl text-amber-900 dark:text-amber-100" style={{ fontFamily: 'monospace' }}>
                                  {item.price}
                                </span>
                              </div>
                              <Button
                                onClick={() => handlePurchase(item)}
                                disabled={owned || loading === item.id || item.price === 0}
                                size="lg"
                                variant={owned ? "secondary" : "default"}
                                className="font-bold"
                                style={{ 
                                  fontFamily: 'monospace',
                                  boxShadow: '0 3px 0 rgba(0, 0, 0, 0.2)'
                                }}
                              >
                                {owned ? "✓ Owned" : loading === item.id ? "Buying..." : item.price === 0 ? "Free!" : "Buy"}
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="dressup" className="space-y-6">
                {Object.keys(groupedInventory).length === 0 ? (
                  <Card 
                    className="p-16 text-center border-4 border-amber-900/20 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-950"
                    style={{ boxShadow: '0 4px 0 rgba(139, 69, 19, 0.2), 0 8px 12px rgba(0,0,0,0.1)' }}
                  >
                    <div className="text-7xl mb-6 drop-shadow-lg">🛍️</div>
                    <p className="text-3xl font-bold mb-3 text-amber-900 dark:text-amber-100" style={{ fontFamily: 'monospace' }}>
                      Your wardrobe is empty!
                    </p>
                    <p className="text-lg text-amber-800 dark:text-amber-200">
                      Visit the shop to buy items and customize your character
                    </p>
                  </Card>
                ) : (
                  <>
                    {Object.entries(groupedInventory).map(([category, categoryItems]) => (
                      <div key={category}>
                        <div 
                          className="flex items-center gap-3 mb-4 px-4 py-2 bg-amber-100 dark:bg-amber-900 rounded-lg border-2 border-amber-900/30"
                          style={{ boxShadow: '0 2px 0 rgba(139, 69, 19, 0.2)' }}
                        >
                          <span className="text-3xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                          <h2 className="text-2xl font-bold capitalize text-amber-900 dark:text-amber-100" style={{ fontFamily: 'monospace' }}>
                            {category}
                          </h2>
                          <Badge 
                            variant="secondary" 
                            className="ml-2 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 border-2 border-green-600"
                            style={{ fontFamily: 'monospace' }}
                          >
                            {categoryItems.filter(i => i.isEquipped).length} equipped
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {categoryItems.map((item) => {
                            return (
                              <Card 
                                key={item.id} 
                                className={`p-6 flex flex-col transition-all border-4 ${
                                  item.isEquipped 
                                    ? 'border-green-600 dark:border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 shadow-2xl' 
                                    : 'border-amber-900/20 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-950 hover:shadow-xl'
                                }`}
                                style={{ 
                                  boxShadow: item.isEquipped
                                    ? '0 6px 0 rgba(22, 163, 74, 0.4), 0 12px 20px rgba(0,0,0,0.3)' 
                                    : '0 4px 0 rgba(139, 69, 19, 0.2), 0 8px 12px rgba(0,0,0,0.1)',
                                  imageRendering: 'pixelated'
                                }}
                              >
                                <div className="mb-4 flex justify-center">
                                  <ItemIcon icon={item.icon} category={item.category} />
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-amber-900 dark:text-amber-100" style={{ fontFamily: 'monospace' }}>
                                  {item.name}
                                </h3>
                                <p className="text-sm text-amber-800 dark:text-amber-200 mb-4 flex-1">
                                  {item.description}
                                </p>
                                <Button
                                  onClick={() => handleEquip(item)}
                                  size="lg"
                                  variant={item.isEquipped ? "secondary" : "default"}
                                  className="w-full font-bold"
                                  style={{ 
                                    fontFamily: 'monospace',
                                    boxShadow: '0 3px 0 rgba(0, 0, 0, 0.2)'
                                  }}
                                >
                                  {item.isEquipped ? "✓ Wearing" : "Wear This"}
                                </Button>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
