import { useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
// import useAuth from '../hooks/useAuth';
import Feather from '@expo/vector-icons/Feather';
import { useColorScheme } from "nativewind";
import { Controller, useForm } from "react-hook-form";
import { Input } from '../../components/ui/input';
import Layout from './components/Layout';


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  // const { login } = useAuth();
  const theme = useTheme();
  console.log('theme', theme);

  const handleLogin = () => {
    navigation.navigate('ChatPage');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark'

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = (data) => console.log(data)

  return (
    <Layout>
      <View className='w-full'>
        <View className='pb-7'>
          <Text className='text-center text-navi-text-bold text-4xl pb-4'>Welcome</Text>
          <Text className='text-center text-navi-text-meeker text-sm'>
            Use your email or another service to login
          </Text>
        </View>

        <View className='flex flex-col gap-6'>
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex-row gap-2 items-center border-b border-navi-border-muted px-2">
                <Feather name="mail" size={20} color="black" />
                <Input
                  placeholder="Email"
                  className="flex-1 py-4 rounded-none shadow-none border-0
                  focus:border-0 placeholder:text-base placeholder:text-navi-text-meeker"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.email && <Text className='text-red-500'>Email is required.</Text>}

          <Controller
            name="password"
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex-row gap-2 items-center border-b border-navi-border-muted px-2">
                <Feather name="lock" size={20} color="black" />
                <Input
                  placeholder="Password"
                  className="flex-1 py-4 rounded-none shadow-none border-0
                focus:border-0 placeholder:text-base placeholder:text-navi-text-meeker"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />

          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </Layout>
  );
} 