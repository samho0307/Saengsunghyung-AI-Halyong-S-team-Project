import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gemini } from '../services/gemini';
import { useAvatarStore } from '../store/avatarStore';

interface AvatarPreviewProps {
  skinColor: string;
  hairStyle: string;
  outfit: string;
}

export default function AvatarPreview({ skinColor, hairStyle, outfit }: AvatarPreviewProps) {
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Use global store instead of local state for image persistence
  const { generatedAvatarUrl, setGeneratedAvatarUrl } = useAvatarStore();
  
  const handleSend = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    setIsLoading(true);
    const prompt = chatInput;
    setChatInput('');

    // Call Gemini Imagen API
    const response = await gemini.generateAvatar(prompt);
    
    if (response.success && response.imageUri) {
      setGeneratedAvatarUrl(response.imageUri); // Save to global store
    } else {
      console.log("Failed:", response.error);
    }
    
    setIsLoading(false);
  };

  return (
    <View className="w-full aspect-square bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 relative">
      {/* 1. Avatar Rendering Layer */}
      <View className="flex-1 items-center justify-center pb-10">
        {generatedAvatarUrl ? (
          <Image 
            source={{ uri: generatedAvatarUrl }} 
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          // Placeholder completely removed (empty view)
          <View />
        )}
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/70 items-center justify-center z-10">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-white text-xs mt-2 font-bold">Gemini가 그리는 중...</Text>
        </View>
      )}

      {/* 2. Interaction Overlay Layer (Input Only) - No Bubble */}
      <View className="absolute inset-x-0 bottom-4 px-4">
        <View className="flex-row items-center bg-black/60 rounded-full p-1 border border-white/10 backdrop-blur-md">
          <TextInput
            value={chatInput}
            onChangeText={setChatInput}
            placeholder={isLoading ? "생성 중입니다..." : "예: 안경 쓴 지적인 친구"}
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white px-4 py-3 text-sm"
            editable={!isLoading}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity 
            onPress={handleSend}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full items-center justify-center mr-1 ${
              isLoading ? 'bg-gray-600' : 'bg-blue-600'
            }`}
          >
            <Ionicons name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
