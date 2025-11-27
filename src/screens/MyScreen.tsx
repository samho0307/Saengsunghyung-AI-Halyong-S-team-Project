import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAvatarStore } from '../store/avatarStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyScreen() {
  const { generatedAvatarUrl } = useAvatarStore();

  const handleSave = () => {
    Alert.alert("저장 완료", "갤러리에 아바타가 저장되었습니다! (Mock)");
  };

  const handleShare = () => {
    Alert.alert("공유하기", "공유 기능이 준비 중입니다!");
  };

  return (
    <View className="flex-1 bg-black">
      {/* 1. Fixed Gradient Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Dark Gradient Overlay for readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        className="absolute inset-0 w-full h-full"
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Header Profile Section */}
          <View className="items-center py-8 mb-4">
            <View className="w-28 h-28 rounded-full border-2 border-white/30 mb-4 items-center justify-center overflow-hidden relative shadow-lg shadow-white/10 bg-black/30 backdrop-blur-md">
               {generatedAvatarUrl ? (
                  <Image source={{ uri: generatedAvatarUrl }} className="w-full h-full" />
               ) : (
                  <Ionicons name="person" size={48} color="rgba(255,255,255,0.5)" />
               )}
            </View>
            <Text className="text-white text-2xl font-bold mb-1 shadow-black shadow-md">AI 친구</Text>
            <View className="flex-row items-center bg-white/10 border border-white/20 px-3 py-1 rounded-full mt-1 backdrop-blur-sm">
               <Text className="text-gray-200 text-xs font-bold mr-1">Lv.5</Text>
               <Text className="text-gray-400 text-xs">소울메이트</Text>
            </View>
          </View>

          {/* Action Buttons Grid */}
          <View className="flex-row px-4 gap-4 mb-6">
            <TouchableOpacity 
              onPress={handleSave}
              className="flex-1 bg-white/10 p-4 rounded-2xl items-center justify-center border border-white/10 backdrop-blur-md"
            >
              <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="download" size={20} color="white" />
              </View>
              <Text className="text-white font-bold">저장</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleShare}
              className="flex-1 bg-white/10 p-4 rounded-2xl items-center justify-center border border-white/10 backdrop-blur-md"
            >
              <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="share-social" size={20} color="white" />
              </View>
              <Text className="text-white font-bold">공유</Text>
            </TouchableOpacity>
          </View>

          {/* Menu List */}
          <View className="px-4 space-y-4 gap-4">
            {/* Section 1 */}
            <View className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-lg">
              <View className="px-5 py-4 border-b border-white/5 bg-white/5">
                 <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">이벤트 & 퀘스트</Text>
              </View>
              <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-white/5 active:bg-white/10">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-white/10 rounded-full items-center justify-center mr-4">
                    <Ionicons name="trophy" size={16} color="#FFFFFF" />
                  </View>
                  <Text className="text-white font-medium text-base">일일 미션</Text>
                </View>
                <View className="bg-white w-2 h-2 rounded-full shadow-white shadow-sm" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-5 active:bg-white/10">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-green-500/20 rounded-full items-center justify-center mr-4">
                    <Ionicons name="calendar" size={16} color="#34D399" />
                  </View>
                  <Text className="text-white font-medium text-base">출석 체크</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
              </TouchableOpacity>
            </View>

            {/* Section 2 */}
            <View className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-lg">
              <View className="px-5 py-4 border-b border-white/5 bg-white/5">
                 <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">설정</Text>
              </View>
              <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-white/5 active:bg-white/10">
                <Text className="text-white text-base pl-2">알림 설정</Text>
                <Ionicons name="toggle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-5 active:bg-white/10">
                <Text className="text-white text-base pl-2">계정 관리</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
