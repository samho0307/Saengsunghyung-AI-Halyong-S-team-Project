import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useAvatarStore } from '../store/avatarStore';

interface WizardMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  type?: 'text' | 'options';
  options?: { label: string; value: string }[];
}

export default function CharacterCreationWizard() {
  const { setCreated, setSkinColor, setHairStyle, setOutfit } = useAvatarStore();
  const [messages, setMessages] = useState<WizardMessage[]>([
    { id: '1', text: "Hello! Let's create your avatar together.", sender: 'bot' },
    { id: '2', text: "First, choose a skin tone.", sender: 'bot', type: 'options', options: [
      { label: 'Pale', value: '#F0D5B1' },
      { label: 'Tan', value: '#E0AC69' },
      { label: 'Dark', value: '#8D5524' }
    ]}
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const addMessage = (msg: WizardMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleOptionSelect = (label: string, value: string) => {
    // User selection message
    addMessage({ id: Date.now().toString(), text: label, sender: 'user' });

    // Process selection based on step
    if (step === 0) {
      setSkinColor(value);
      setTimeout(() => {
        addMessage({ 
          id: Date.now().toString(), 
          text: "Great choice! Now, what kind of hair style do you prefer?", 
          sender: 'bot',
          type: 'options',
          options: [
            { label: 'Short', value: 'short' },
            { label: 'Long', value: 'long' },
            { label: 'Curly', value: 'curly' }
          ]
        });
        setStep(1);
      }, 500);
    } else if (step === 1) {
      setHairStyle(value);
      setTimeout(() => {
        addMessage({ 
          id: Date.now().toString(), 
          text: "Awesome. Finally, pick an outfit style.", 
          sender: 'bot',
          type: 'options',
          options: [
            { label: 'Casual', value: 'casual' },
            { label: 'Formal', value: 'formal' },
            { label: 'Sporty', value: 'sporty' }
          ]
        });
        setStep(2);
      }, 500);
    } else if (step === 2) {
      setOutfit(value);
      setTimeout(() => {
        addMessage({ 
          id: Date.now().toString(), 
          text: "All set! Creating your character now...", 
          sender: 'bot' 
        });
        setTimeout(() => setCreated(true), 1500);
      }, 500);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage({ id: Date.now().toString(), text: input, sender: 'user' });
    setInput('');
    
    // Fallback for text input if needed (currently using options flow)
    setTimeout(() => {
      addMessage({ id: Date.now().toString(), text: "Please select one of the options above.", sender: 'bot' });
    }, 500);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View className={`mb-4 ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <View className={`p-4 rounded-2xl max-w-[80%] ${
              item.sender === 'user' ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-800 rounded-tl-none'
            }`}>
              <Text className="text-white text-base">{item.text}</Text>
            </View>
            
            {/* Options Chips */}
            {item.sender === 'bot' && item.type === 'options' && item.options && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {item.options.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => handleOptionSelect(opt.label, opt.value)}
                    className="bg-gray-700 px-4 py-2 rounded-full border border-gray-600"
                  >
                    <Text className="text-blue-400 font-bold">{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      />
      
      {/* Input Area (Optional for free text) */}
      <View className="p-4 border-t border-gray-800 bg-gray-900">
        <View className="flex-row items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type here..."
            placeholderTextColor="#6B7280"
            className="flex-1 bg-gray-800 text-white p-3 rounded-full mr-2"
          />
          <TouchableOpacity onPress={handleSend} className="bg-blue-600 p-3 rounded-full">
            <Text className="text-white font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

