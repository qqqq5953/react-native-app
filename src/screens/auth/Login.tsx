import { Link, useTheme } from '@react-navigation/native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// import useAuth from '../hooks/useAuth';
import Feather from '@expo/vector-icons/Feather';
import { Checkbox } from 'expo-checkbox';
import { useColorScheme } from "nativewind";
import { Controller, useForm } from "react-hook-form";
import { Input } from '../../components/ui/input';
import Layout from './Layout';
import TogglePassword from './components/TogglePassword';

export default function Login() {
  const theme = useTheme();
  // console.log('theme', theme);

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark'

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);

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

  const onSubmit = (data: any) => console.log(data)
  const [isChecked, setChecked] = useState(false);

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
          <View className='flex flex-col gap-2'>
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
                    keyboardType="email-address"
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
          </View>

          <View className='flex flex-col gap-2'>
            <Controller
              name="password"
              control={control}
              rules={{ maxLength: 100, required: true }}
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-2 items-center border-b border-navi-border-muted px-2">
                  <Feather name="lock" size={20} color="black" />
                  <Input
                    placeholder="Password"
                    className="flex-1 py-4 rounded-none shadow-none border-0 focus:border-0 placeholder:text-base placeholder:text-navi-text-meeker"
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    onFocus={() => {
                      setShowPasswordToggle(true);
                    }}
                    onBlur={() => {
                      setShowPasswordToggle(false);
                    }}
                  />
                  <TogglePassword
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showButton={showPasswordToggle}
                    setShowButton={setShowPasswordToggle}
                  />
                </View>
              )}
            />
            {errors.password && <Text className='text-red-500'>Password is required.</Text>}
          </View>

          <View className='flex-row pb-3'>
            <View className='flex-row items-center gap-2'>
              <Checkbox
                className='border'
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#4630EB' : undefined}
              />
              <Text>Remember me</Text>
            </View>

            <Link screen="ForgetPassword" params={{}} className='ml-auto underline'>
              <Text>Forgot password?</Text>
            </Link>
          </View>

          <TouchableOpacity onPress={handleSubmit(onSubmit)} className='flex justify-center items-center p-4 rounded-xl bg-indigo-600'>
            <Text className='text-white text-lg'>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
} 