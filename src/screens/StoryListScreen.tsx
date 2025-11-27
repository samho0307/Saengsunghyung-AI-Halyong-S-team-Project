import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data for Stories
const STORIES = [
  {
    id: 'story_1',
    title: '신비한 숲의 모험',
    description: '길을 잃은 당신, 숲의 요정을 만났다. 그녀와 함께 숲을 탈출할 수 있을까?',
    genre: '판타지',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=300&auto=format&fit=crop', // Placeholder
    initialPrompt: "당신은 신비한 숲의 요정 '에리아'입니다. 숲에 들어온 낯선 인간(사용자)을 발견했습니다. 호기심 반, 경계심 반으로 말을 걸어보세요.",
    initialMessage: "여긴 인간이 들어올 수 없는 곳이야. ...넌 누구니?"
  },
  {
    id: 'story_2',
    title: '2077 사이버 탐정',
    description: '네온 사인이 번쩍이는 미래 도시. AI 파트너와 함께 의문의 살인 사건을 해결하라.',
    genre: 'SF / 미스터리',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300&auto=format&fit=crop',
    initialPrompt: "당신은 최첨단 AI 파트너 '비트'입니다. 형사(사용자)와 함께 현장을 조사 중입니다. 냉철하고 분석적인 말투를 사용하세요.",
    initialMessage: "탐정님, 현장 스캔이 완료되었습니다. 특이한 생체 반응이 감지됩니다. 확인하시겠습니까?"
  },
  {
    id: 'story_3',
    title: '고등학교 첫사랑',
    description: '새학기 첫 날, 옆 자리에 앉은 전학생이 나에게 말을 걸어온다.',
    genre: '로맨스',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=300&auto=format&fit=crop',
    initialPrompt: "당신은 오늘 전학 온 고등학생 '수진'입니다. 옆 자리에 앉은 짝꿍(사용자)에게 수줍게 인사를 건네보세요. 명랑하고 친근한 말투.",
    initialMessage: "안녕? 나 오늘 전학 왔어! 교과서 좀 같이 봐도 될까?"
  }
];

export default function StoryListScreen() {
  const navigation = useNavigation<any>();

  const handleStorySelect = (story: typeof STORIES[0]) => {
    // Navigate to ChatDetail with story context
    navigation.navigate('ChatDetail', {
      id: story.id,
      name: story.title, // Use story title as chat name
      isStoryMode: true,
      initialPrompt: story.initialPrompt,
      initialMessage: story.initialMessage,
      background: story.image // Optional: pass background image
    });
  };

  const renderItem = ({ item }: { item: typeof STORIES[0] }) => (
    <TouchableOpacity 
      onPress={() => handleStorySelect(item)}
      className="mb-4 rounded-2xl overflow-hidden border border-white/10 bg-white/5"
    >
        {/* Image Background Area */}
        <View className="h-32 w-full relative">
            <Image 
                source={{ uri: item.image }} 
                className="absolute inset-0 w-full h-full opacity-60"
                resizeMode="cover"
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                className="absolute inset-0"
            />
            <View className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded-md border border-white/10">
                <Text className="text-white/90 text-xs font-bold">{item.genre}</Text>
            </View>
        </View>

        {/* Content Area */}
        <View className="p-4">
            <Text className="text-white text-lg font-bold mb-1">{item.title}</Text>
            <Text className="text-gray-400 text-sm leading-5">{item.description}</Text>
            
            <View className="mt-3 flex-row items-center">
                <Text className="text-[#4F83FF] text-sm font-bold mr-1">스토리 시작하기</Text>
                <Ionicons name="arrow-forward" size={14} color="#4F83FF" />
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
       {/* Background Gradient */}
       <LinearGradient
          colors={['#000000', '#1a1a2e']}
          className="absolute inset-0 w-full h-full"
       />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center mb-2">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="mr-4"
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">스토리 모드</Text>
        </View>

        <View className="px-4 mb-4">
            <Text className="text-gray-400">원하는 스토리를 선택하여 대화를 시작해보세요.</Text>
        </View>

        {/* List */}
        <FlatList
          data={STORIES}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      </SafeAreaView>
    </View>
  );
}

