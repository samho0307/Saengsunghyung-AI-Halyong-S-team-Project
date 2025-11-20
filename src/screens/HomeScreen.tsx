import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAvatarStore } from '../store/avatarStore';
import CustomizerPanel from '../components/CustomizerPanel';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { gemini } from '../services/gemini';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const { generatedAvatarUrl, setGeneratedAvatarUrl } = useAvatarStore();
  const [category, setCategory] = useState('hair');
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    setIsLoading(true);
    const prompt = chatInput;
    setChatInput('');

    // Call Gemini Imagen API
    const response = await gemini.generateAvatar(prompt);
    
    if (response.success && response.imageUri) {
      setGeneratedAvatarUrl(response.imageUri);
    } else {
      console.log("Failed:", response.error);
    }
    
    setIsLoading(false);
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("권한 필요", "사진을 업로드하려면 갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setGeneratedAvatarUrl(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-black">
       {/* 1. Full Screen Background (Avatar Preview) */}
       {generatedAvatarUrl ? (
        <Image 
          source={{ uri: generatedAvatarUrl }} 
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          className="absolute inset-0 w-full h-full"
        />
      )}
      
      {/* Gradient Overlay for UI readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-2 z-10">
          <View className="bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
             <Text className="text-white text-lg font-bold">홈</Text>
          </View>
          
          <View className="flex-row items-center bg-black/30 px-3 py-2 rounded-full backdrop-blur-md border border-white/10">
            <Ionicons name="diamond" size={16} color="#FBBF24" />
            <Text className="text-white ml-2 font-bold">1,250</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
            {/* Loading Indicator */}
            {isLoading && (
                <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-black/60 p-4 rounded-2xl backdrop-blur-md">
                        <ActivityIndicator size="large" color="#F472B6" />
                        <Text className="text-white mt-2 font-bold">새로운 모습 그리는 중...</Text>
                    </View>
                </View>
            )}

            {/* Input Field for Generation (Floating above panel) */}
            <View className="px-4 mb-4">
                <View className="flex-row items-center bg-black/60 rounded-full p-1 border border-white/20 backdrop-blur-xl shadow-lg">
                    {/* Image Upload Button */}
                    <TouchableOpacity 
                        onPress={pickImage}
                        disabled={isLoading}
                        className="w-10 h-10 rounded-full items-center justify-center ml-1 bg-white/10"
                    >
                        <Ionicons name="image" size={20} color="white" />
                    </TouchableOpacity>

                    <TextInput
                        value={chatInput}
                        onChangeText={setChatInput}
                        placeholder={isLoading ? "생성 중..." : "예: 핑크색 머리, 안경 쓴 스타일"}
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-white px-3 py-3 text-sm"
                        editable={!isLoading}
                        onSubmitEditing={handleGenerate}
                    />
                    <TouchableOpacity 
                        onPress={handleGenerate}
                        disabled={isLoading}
                        className={`w-10 h-10 rounded-full items-center justify-center mr-1 ${
                        isLoading ? 'bg-gray-600' : 'bg-pink-400' // Changed to Pink
                        }`}
                    >
                        <Ionicons name="sparkles" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Customizer Panel (Bottom Sheet style) */}
            <View className="h-[40%] bg-black/80 rounded-t-3xl border-t border-white/10 backdrop-blur-lg overflow-hidden">
                <CustomizerPanel 
                    currentCategory={category} 
                    setCategory={setCategory} 
                />
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
