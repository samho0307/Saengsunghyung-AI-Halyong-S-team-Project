import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen({ navigation }: any) {
  const { signup } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return;
    }
    
    signup(email, "New User");
    navigation.replace('Onboarding');
  };

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={['#000000', '#1a1a2e']}
        className="absolute inset-0 w-full h-full"
      />
      
      <SafeAreaView className="flex-1 px-8 pt-4">
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold mb-2">회원가입</Text>
        <Text className="text-gray-400 text-base mb-8">새로운 계정을 만들어보세요.</Text>

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

          <View>
            <Text className="text-gray-400 mb-2 ml-1">비밀번호 확인</Text>
            <TextInput
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="********"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            onPress={handleSignup}
            className="bg-white w-full py-4 rounded-xl items-center mt-4 shadow-lg shadow-white/20"
          >
            <Text className="text-black font-bold text-lg">다음</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}


