import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChatPage from '../screens/ChatPage';
import ForgetPassword from '../screens/ForgetPassword';
import Login from '../screens/Login';

export type RootStackParamList = {
  Login: undefined;
  ForgetPassword: undefined;
  ChatPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ChatPage" component={ChatPage} />
    </Stack.Navigator>
  );
} 