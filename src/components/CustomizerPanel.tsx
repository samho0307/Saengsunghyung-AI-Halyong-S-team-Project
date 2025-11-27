import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useItemStore } from '../store/itemStore';

interface CustomizerPanelProps {
  currentCategory: string;
  setCategory: (category: string) => void;
  onSelect: (itemPrompt: string) => void; // Add callback for selection
}

const CATEGORIES = [
  { id: 'hair', label: '헤어' },
  { id: 'outfit', label: '의상' },
  { id: 'accessory', label: '악세서리' },
  { id: 'background', label: '배경' }
];

export default function CustomizerPanel({ currentCategory, setCategory, onSelect }: CustomizerPanelProps) {
  const { items, purchaseItem } = useItemStore();
  
  // Filter items by current category
  const categoryItems = items.filter(item => item.type === currentCategory);

  // Expanded Mock data with visual prompts
  const displayItems = categoryItems.length > 0 ? categoryItems : [
    { id: '1', name: '단발 핑크', price: 0, owned: true, prompt: "short pink bob hair" },
    { id: '2', name: '긴 웨이브', price: 100, owned: false, prompt: "long wavy brown hair" },
    { id: '3', name: '포니테일', price: 500, owned: false, prompt: "high ponytail blonde hair" },
    { id: '4', name: '양갈래', price: 1000, owned: false, prompt: "twin tails blue hair" },
    { id: '5', name: '정장', price: 0, owned: true, prompt: "formal black suit" },
    { id: '6', name: '캐주얼', price: 100, owned: false, prompt: "casual hoodie and jeans" },
    { id: '7', name: '드레스', price: 500, owned: false, prompt: "elegant red evening dress" },
    { id: '8', name: '교복', price: 1000, owned: false, prompt: "school uniform" },
  ].filter(item => {
      // Simple categorization for mock items
      if (currentCategory === 'hair') return item.prompt.includes('hair');
      if (currentCategory === 'outfit') return !item.prompt.includes('hair');
      return true;
  });

  const handlePress = (item: any) => {
    if (!item.owned) {
        purchaseItem(item.id);
    }
    // Always select/apply if owned (or after purchase)
    // For smoother UX, we might want to apply immediately or wait for purchase. 
    // Here we apply immediately for demo purposes if owned, or after purchase.
    // Simplifying to: Select -> Parent handles generation
    onSelect(item.prompt);
  };

  return (
    <View className="flex-1 bg-transparent">
      {/* Category Tabs */}
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-grow-0 py-4 border-b border-white/10"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              className={`mr-4 px-6 py-2 rounded-full border ${
                currentCategory === cat.id 
                  ? 'bg-white border-white' 
                  : 'bg-white/10 border-white/5'
              }`}
            >
              <Text className={`font-bold ${
                currentCategory === cat.id ? 'text-black' : 'text-gray-300'
              }`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Items Grid */}
      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }} 
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="w-[30%] aspect-square bg-white/5 rounded-xl mb-4 items-center justify-center border border-white/10 active:bg-white/20"
            onPress={() => handlePress(item)}
          >
            <Text className="text-white font-medium mb-1 text-center">{item.name}</Text>
            {item.owned ? (
              <Text className="text-black text-xs bg-white px-2 py-0.5 rounded font-bold">착용</Text>
            ) : (
              <Text className="text-yellow-400 text-xs">{item.price} P</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
