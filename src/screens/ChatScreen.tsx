import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useChatStore } from '../store/chatStore';
import { useAvatarStore } from '../store/avatarStore';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { gemini } from '../services/gemini';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { name, isStoryMode, initialPrompt, initialMessage, background } = route.params || { name: 'AI 친구' };

  const { messages, addMessage, clearMessages } = useChatStore();
  const { generatedAvatarUrl } = useAvatarStore();
  const { preferences } = useAuthStore();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string | undefined>(undefined);

  // Initialize Story Mode
  useEffect(() => {
    if (isStoryMode) {
      console.log("Entering Story Mode:", name);
      
      // Clear previous messages to start fresh story
      clearMessages();
      
      // Set system prompt for this session
      if (initialPrompt) {
        setSystemPrompt(initialPrompt);
      }

      // Add initial bot message if provided
      if (initialMessage) {
        addMessage({
          id: 'story-init',
          text: initialMessage,
          sender: 'bot',
          timestamp: Date.now(),
        });
      }
    } else {
      // Reset system prompt for normal chat
      setSystemPrompt(undefined);
    }
  }, [isStoryMode, initialPrompt, initialMessage, name]);

  // Update last bot message for subtitle display
  useEffect(() => {
    const botMsgs = messages.filter(m => m.sender === 'bot');
    if (botMsgs.length > 0) {
      setLastBotMessage(botMsgs[botMsgs.length - 1].text);
    } else {
      setLastBotMessage(null);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input;
    setInput('');

    // 1. Add User Message
    addMessage({
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: Date.now(),
    });
    
    // 2. Call Gemini API
    setIsTyping(true);
    try {
      // Pass preferences AND systemPrompt (if story mode)
      const response = await gemini.chat(userText, preferences, systemPrompt);
      if (response.success) {
        addMessage({
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: Date.now(),
          emotion: response.emotion
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  // Determine background image
  // Priority: Story Background > Generated Avatar > Fallback
  const backgroundImage = background ? { uri: background } : (generatedAvatarUrl ? { uri: generatedAvatarUrl } : null);

  return (
    <View className="flex-1 bg-black">
      {/* 1. Full Screen Background */}
      {backgroundImage ? (
        <Image 
          source={backgroundImage} 
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ) : (
        // Fallback Gradient if no character yet
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          className="absolute inset-0 w-full h-full"
        />
      )}

      {/* Gradient Overlay for readability at bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        className="absolute inset-x-0 bottom-0 h-64"
      />

      <SafeAreaView className="flex-1 justify-between">
        {/* Top Area: Header & Status */}
        <View className="px-4 py-2 flex-row justify-between items-center relative">
           {/* Left: Back Button */}
           <TouchableOpacity 
             onPress={() => navigation.goBack()} 
             className="w-10 h-10 items-center justify-center bg-black/30 rounded-full border border-white/10 backdrop-blur-md z-50"
             hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
           >
             <Ionicons name="chevron-back" size={24} color="white" />
           </TouchableOpacity>

           {/* Center: Status Badge (Absolute Centered) */}
           <View className="absolute left-0 right-0 items-center justify-center pointer-events-none">
             <View className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-md flex-row items-center border border-white/10">
               <View className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
               <Text className="text-white font-bold text-sm">{name}</Text>
             </View>
           </View>

           {/* Right: Settings Button */}
           <TouchableOpacity className="bg-black/30 p-2 rounded-full backdrop-blur-md border border-white/10">
             <Ionicons name="settings-outline" size={24} color="white" />
           </TouchableOpacity>
        </View>

        {/* Middle Area: Subtitle / Interaction Text */}
        <View className="flex-1 justify-center items-center px-8">
          {/* Start Talking Button (Visual Only for now) */}
          {!lastBotMessage && (
             <View className="bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
               <Text className="text-white font-medium">대화를 시작하세요</Text>
             </View>
          )}
          
          {/* Bot Response Subtitle */}
          {lastBotMessage && (
            <View className="bg-black/60 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 max-w-full">
              <Text className="text-white text-center text-lg leading-6 shadow-md">
                {lastBotMessage}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Area: Controls */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View className="px-4 pb-6">
            {/* Control Buttons Row */}
            <View className="flex-row justify-center items-center mb-4 px-4 gap-6">
               <TouchableOpacity className="w-12 h-12 bg-gray-800/80 rounded-2xl items-center justify-center border border-white/10">
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

            {/* Text Input Bar */}
            <View className="bg-white/10 backdrop-blur-xl rounded-3xl flex-row items-center px-4 py-1 border border-white/10">
               <TextInput
                 className="flex-1 text-white py-3 text-base"
                 placeholder="무엇이든 물어보세요..."
                 placeholderTextColor="#9CA3AF"
                 value={input}
                 onChangeText={setInput}
                 onSubmitEditing={handleSend}
               />
               <TouchableOpacity 
                  onPress={handleSend}
                  disabled={!input.trim()}
                  className={`p-2 rounded-full ${input.trim() ? 'bg-white' : 'bg-transparent'}`}
               >
                  {isTyping ? (
                     <ActivityIndicator size="small" color="black" />
                  ) : (
                     <Ionicons name="arrow-up" size={20} color={input.trim() ? "black" : "gray"} />
                  )}
               </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
