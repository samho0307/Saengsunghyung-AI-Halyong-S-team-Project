import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useItemStore } from '../store/itemStore';

interface CustomizerPanelProps {
  currentCategory: string;
  setCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: 'hair', label: '헤어' },
  { id: 'outfit', label: '의상' },
  { id: 'accessory', label: '악세서리' },
  { id: 'background', label: '배경' }
];

export default function CustomizerPanel({ currentCategory, setCategory }: CustomizerPanelProps) {
  const { items, purchaseItem } = useItemStore();
  
  // Filter items by current category
  const categoryItems = items.filter(item => item.type === currentCategory);

  // Mock data if empty (for UI visualization)
  const displayItems = categoryItems.length > 0 ? categoryItems : [
    { id: '1', name: '기본 스타일', price: 0, owned: true },
    { id: '2', name: '프리미엄', price: 100, owned: false },
    { id: '3', name: '스페셜', price: 500, owned: false },
    { id: '4', name: '레어', price: 1000, owned: false },
  ];

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
            className="w-[30%] aspect-square bg-white/5 rounded-xl mb-4 items-center justify-center border border-white/10"
            onPress={() => !item.owned && purchaseItem(item.id)}
          >
            <Text className="text-white font-medium mb-1 text-center">{item.name}</Text>
            {item.owned ? (
              <Text className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">보유중</Text>
            ) : (
              <Text className="text-yellow-400 text-xs">{item.price} P</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
