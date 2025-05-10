import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5">Login</Text>
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg w-full my-2.5"
        onPress={() => navigation.navigate('ForgetPassword')}
      >
        <Text className="text-white text-center text-base font-semibold">Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg w-full my-2.5"
        onPress={() => navigation.navigate('ChatPage')}
      >
        <Text className="text-white text-center text-base font-semibold">Login</Text>
      </TouchableOpacity>
    </View>
  );
} 