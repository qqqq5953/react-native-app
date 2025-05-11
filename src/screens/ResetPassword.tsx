import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPassword() {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const { completePasswordReset } = useAuth();

  const handleResetComplete = () => {
    completePasswordReset();
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5">Reset Password</Text>
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg w-full my-2.5"
        onPress={handleResetComplete}
      >
        <Text className="text-white text-center text-base font-semibold">Complete Reset</Text>
      </TouchableOpacity>
    </View>
  );
} 