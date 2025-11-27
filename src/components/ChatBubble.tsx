import React from 'react';
import { View, Text } from 'react-native';
import { Message } from '../store/chatStore';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';
  
  return (
    <View className={`my-1 max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
      <View 
        className={`p-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 rounded-tr-none' 
            : 'bg-gray-800 rounded-tl-none'
        }`}
      >
        <Text className="text-white text-base leading-5">
          {message.text}
        </Text>
      </View>
      
      {/* Meta info */}
      <View className="flex-row mt-1 items-center gap-2">
        {!isUser && message.emotion && (
          <Text className="text-xs text-gray-400 capitalize">
            {message.emotion}
          </Text>
        )}
        <Text className="text-[10px] text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

