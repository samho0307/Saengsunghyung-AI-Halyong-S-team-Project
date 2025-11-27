import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }
    // Mock Login Logic
    login(email);
  };

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={['#000000', '#1a1a2e']}
        className="absolute inset-0 w-full h-full"
      />
      
      <SafeAreaView className="flex-1 justify-center px-8">
        {/* Logo / Title */}
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-white/10 rounded-full items-center justify-center mb-4 border border-white/20 shadow-lg shadow-white/20">
             <Ionicons name="chatbubbles" size={48} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">AI Friend</Text>
          <Text className="text-gray-400 text-base">당신만의 AI 소울메이트</Text>
        </View>

        {/* Form */}
        <View className="space-y-4 gap-4">
          <View>
            <Text className="text-gray-400 mb-2 ml-1">이메일</Text>
            <TextInput
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="example@email.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-400 mb-2 ml-1">비밀번호</Text>
            <TextInput
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="********"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            onPress={handleLogin}
            className="bg-white w-full py-4 rounded-xl items-center mt-4 shadow-lg shadow-white/20"
          >
            <Text className="text-black font-bold text-lg">로그인</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500">계정이 없으신가요? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className="text-white font-bold">회원가입</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}


