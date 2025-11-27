import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAvatarStore } from '../store/avatarStore';
import { useAuthStore } from '../store/authStore';
import CustomizerPanel from '../components/CustomizerPanel';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { gemini } from '../services/gemini';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const { generatedAvatarUrl, setGeneratedAvatarUrl, currentPrompt, setCurrentPrompt } = useAvatarStore();
  const { preferences } = useAuthStore();
  const [category, setCategory] = useState('hair');
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Unified Generation Handler
  const performGeneration = async (newPromptPart: string) => {
    if (isLoading) return;
    setIsLoading(true);

    // Strategy: Base Prompt + Modification
    const basePrompt = currentPrompt || "A friendly virtual friend character";
    const fullPrompt = `${basePrompt}, ${newPromptPart}`;
    
    // Update store with the NEW full prompt so next time we build upon it
    setCurrentPrompt(fullPrompt);

    console.log("Generating with prompt:", fullPrompt);

    const response = await gemini.generateAvatar(fullPrompt);

    if (response.success && response.imageUri) {
      const finalImage = await gemini.removeBackground(response.imageUri);
      setGeneratedAvatarUrl(finalImage);
    } else {
      Alert.alert("생성 실패", response.error || "이미지를 생성하지 못했습니다.");
    }
    
    setIsLoading(false);
  };

  const handleInputSubmit = () => {
    if (!chatInput.trim()) return;
    performGeneration(chatInput);
    setChatInput('');
  };

  const handlePanelSelect = (itemPrompt: string) => {
    performGeneration(itemPrompt);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("권한 필요", "사진을 업로드하려면 갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setIsLoading(true);
      
      try {
        console.log("Analyzing image...");
        const description = await gemini.analyzeImage(result.assets[0].base64);
        console.log("Image Description:", description);
        
        const fullPrompt = `Character based on reference photo: ${description}`;
        setCurrentPrompt(fullPrompt);
        
        const response = await gemini.generateAvatar(fullPrompt);
        
        if (response.success && response.imageUri) {
           const finalImage = await gemini.removeBackground(response.imageUri);
           setGeneratedAvatarUrl(finalImage);
        } else {
           Alert.alert("생성 실패", "이미지를 분석했지만 캐릭터 생성에 실패했습니다.");
        }
        
      } catch (error) {
        Alert.alert("오류", "이미지 분석 중 오류가 발생했습니다.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Determine layout state
  const hasGenerated = !!generatedAvatarUrl;

  return (
    <View className="flex-1 bg-black">
       {/* 1. Background Gradient */}
       <LinearGradient
          colors={['#1a1a2e', '#000000']}
          className="absolute inset-0 w-full h-full"
       />

       {/* 2. Character Image (Only if generated) */}
       {hasGenerated && (
        <Image 
          source={{ uri: generatedAvatarUrl }} 
          className="absolute -bottom-10 w-full h-[110%]"
          resizeMode="contain"
        />
      )}
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={hasGenerated ? ['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)'] : ['transparent', 'transparent']}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header (Only show if generated or maybe hide completely for clean look) */}
        {hasGenerated && (
          <View className="px-4 py-4 flex-row justify-between items-center">
            <Text className="text-white text-2xl font-bold">홈</Text>
          </View>
        )}

        {/* Main Content Area */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className={`flex-1 ${hasGenerated ? 'justify-end' : 'justify-center'}`}
        >
            {/* Initial Greeting (Only if NOT generated) */}
            {!hasGenerated && (
              <View className="items-center mb-10">
                <Text className="text-white text-3xl font-bold mb-2">
                  안녕하세요, {preferences?.nickname || '사용자'}님
                </Text>
                <Text className="text-gray-400 text-lg">
                  나만의 AI 친구를 만들어보세요
                </Text>
              </View>
            )}

            {/* Input Field */}
            <View className={`px-4 ${hasGenerated || chatInput.length > 0 ? 'mb-8' : 'mb-0'}`}>
                {/* Control Buttons Row (Only visible when bottom positioned) */}
                {(hasGenerated || chatInput.length > 0) && (
                    <View className="flex-row justify-center items-center mb-4 gap-6">
                        <TouchableOpacity 
                            onPress={pickImage}
                            disabled={isLoading}
                            className="w-12 h-12 bg-gray-800/80 rounded-2xl items-center justify-center border border-white/10"
                        >
                            <Ionicons name="image-outline" size={24} color="white" />
                        </TouchableOpacity>
                        
                        {/* Main Mic Button (Active) */}
                        <TouchableOpacity className="w-16 h-16 bg-white/10 rounded-3xl items-center justify-center border border-white/50 shadow-lg shadow-white/20">
                            <Ionicons name="mic" size={32} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity className="w-12 h-12 bg-gray-800/80 rounded-2xl items-center justify-center border border-white/10">
                            <Ionicons name="people-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Chat Bar */}
                <View className="bg-white/10 backdrop-blur-xl rounded-3xl flex-row items-center px-4 py-1 border border-white/10">
                    {/* Image Upload (Only visible when centered/initial state) */}
                    {!(hasGenerated || chatInput.length > 0) && (
                         <TouchableOpacity 
                            onPress={pickImage}
                            disabled={isLoading}
                            className="mr-2"
                        >
                            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}

                    <TextInput
                        value={chatInput}
                        onChangeText={setChatInput}
                        placeholder="어떤 친구를 만들고 싶나요?"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-white py-3 text-base"
                        editable={!isLoading}
                        onSubmitEditing={handleInputSubmit}
                    />
                    
                    {/* Submit Button */}
                    <TouchableOpacity 
                        onPress={handleInputSubmit}
                        disabled={!chatInput.trim() || isLoading}
                        className={`p-2 rounded-full ${chatInput.trim() ? 'bg-white' : 'bg-transparent'}`}
                    >
                        {isLoading ? (
                        <ActivityIndicator size="small" color="black" />
                        ) : (
                        <Ionicons name="arrow-up" size={20} color={chatInput.trim() ? "black" : "gray"} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
