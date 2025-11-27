import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ChatNavigator from './ChatNavigator'; // Import the new navigator
import MyScreen from '../screens/MyScreen';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          height: 85,
          paddingTop: 10,
          paddingBottom: 30,
        },
        tabBarActiveTintColor: '#FFFFFF', // Changed to White (Grok Theme)
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '대화') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === '마이') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          // Add glow effect for active tab
          if (focused) {
            return (
              <View className="items-center justify-center shadow-lg shadow-white/30">
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="대화" component={ChatNavigator} /> 
      <Tab.Screen name="마이" component={MyScreen} />
    </Tab.Navigator>
  );
}
