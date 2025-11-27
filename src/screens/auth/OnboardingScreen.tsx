import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';

const INTERESTS_LIST = ['게임', '음악', '영화', '독서', '여행', '요리', '운동', '기술', '예술'];
const STYLES_LIST = [
  { id: 'casual', label: '편안한 친구처럼 (반말)' },
  { id: 'formal', label: '예의바른 비서처럼 (존댓말)' },
  { id: 'cute', label: '애교많은 스타일' },
];

export default function OnboardingScreen() {
  const { setPreferences } = useAuthStore();
  
  const [nickname, setNickname] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [communicationStyle, setCommunicationStyle] = useState<'casual' | 'formal' | 'cute'>('casual');
  const [mbti, setMbti] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests(prev => [...prev, interest]);
      }
    }
  };

  const handleComplete = () => {
    if (!nickname) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    setPreferences({
      nickname,
      interests: selectedInterests,
      mbti,
      communicationStyle
    });
  };

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={['#000000', '#1a1a2e']}
        className="absolute inset-0 w-full h-full"
      />
      
      <SafeAreaView className="flex-1">
        <ScrollView className="px-8 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="text-white text-3xl font-bold mb-2">환영합니다!</Text>
          <Text className="text-gray-400 text-base mb-8">AI 친구가 당신에 대해 더 잘 알 수 있도록 알려주세요.</Text>

          {/* 1. Nickname */}
          <View className="mb-8">
            <Text className="text-white font-bold text-lg mb-3">닉네임</Text>
            <TextInput
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="어떻게 불러드릴까요?"
              placeholderTextColor="#666"
              value={nickname}
              onChangeText={setNickname}
            />
          </View>

          {/* 2. Interests */}
          <View className="mb-8">
            <Text className="text-white font-bold text-lg mb-3">관심사 (최대 3개)</Text>
            <View className="flex-row flex-wrap gap-3">
              {INTERESTS_LIST.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleInterest(item)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedInterests.includes(item)
                      ? 'bg-white border-white'
                      : 'bg-white/5 border-white/20'
                  }`}
                >
                  <Text className={selectedInterests.includes(item) ? 'text-black font-bold' : 'text-gray-400'}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3. MBTI */}
          <View className="mb-8">
            <Text className="text-white font-bold text-lg mb-3">MBTI (선택)</Text>
            <TextInput
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="예: ENFP"
              placeholderTextColor="#666"
              value={mbti}
              onChangeText={setMbti}
              maxLength={4}
              autoCapitalize="characters"
            />
          </View>

          {/* 4. Communication Style */}
          <View className="mb-8">
            <Text className="text-white font-bold text-lg mb-3">대화 스타일</Text>
            <View className="gap-3">
              {STYLES_LIST.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  onPress={() => setCommunicationStyle(style.id as any)}
                  className={`px-4 py-4 rounded-xl border flex-row items-center justify-between ${
                    communicationStyle === style.id
                      ? 'bg-white/20 border-white'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <Text className="text-white font-medium">{style.label}</Text>
                  {communicationStyle === style.id && (
                    <View className="w-3 h-3 rounded-full bg-white shadow-sm shadow-white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleComplete}
            className="bg-white w-full py-4 rounded-xl items-center mt-4 shadow-lg shadow-white/20"
          >
            <Text className="text-black font-bold text-lg">시작하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}


