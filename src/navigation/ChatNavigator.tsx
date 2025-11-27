import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import StoryListScreen from '../screens/StoryListScreen';

const Stack = createStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="StoryList" component={StoryListScreen} />
      <Stack.Screen name="ChatDetail" component={ChatScreen} />
    </Stack.Navigator>
  );
}


