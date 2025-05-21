import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useLinkTo, useTheme } from '@react-navigation/native';
import { Checkbox } from 'expo-checkbox';
import { useColorScheme } from "nativewind";
import { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { z } from 'zod';
import { useGet, usePost } from '../../lib/api';
import { handleError } from '../../lib/helper/error';
import TogglePassword from './components/TogglePassword';
import Layout from './Layout';

const formSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).trim(),
  password: z.string().min(1, { message: 'Password is required' }).trim(),
})

export default function Login() {
  const linkTo = useLinkTo();
  const theme = useTheme();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark'

  const loginMutation = usePost<null, { email: string; password: string }>();
  const loginWithAzureMutation = usePost<null, { code: string; state: string }>();

  const [rememberedEmail, setRememberedEmail] = useState<string | null>(null);
  const [isRemembeerMe, setIsRemembeerMe] = useState(!!rememberedEmail);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    values: {
      email: rememberedEmail ?? "",
      password: "",
    },
    mode: "onChange"
  })
  const { isValid, isSubmitting } = form.formState;

  async function onLogin({ email, password }: z.infer<typeof formSchema>) {
    return
    // try {
    //   await loginMutation.mutateAsync({
    //     url: '/auth/login',
    //     data: { email, password }
    //   });
    //   linkTo('/');
    // } catch (error) {
    //   setIsDisabled(true);
    //   handleError({
    //     error,
    //     allDetailTypes: ['invalid_credential', 'user_already_logged_in'],
    //     alreadyHandledDetailTypes: ['invalid_credential'],
    //     nonDetail: { message: 'Login failed' },
    //   });
    // }
  }

  async function onRememberMeChange(isChecked: boolean) {
    setIsRemembeerMe(isChecked);
    if (isChecked && !form.formState.errors.email) {
      await AsyncStorage.setItem('rememberMe', form.getValues('email'));
    } else {
      await AsyncStorage.removeItem('rememberMe');
    }
  }

  // azure login
  const [startAzureLogin, setStartAzureLogin] = useState(false);
  const code = undefined
  const state = undefined
  const isAzureLoggingIn = startAzureLogin || (!!code && !!state);

  const { refetch: getAzureAuthenticationUrl } = useGet<{ url: string }>({
    url: '/auth/azure/authentication-url',
    queryKey: ['azureAuthenticationUrl'],
    options: { enabled: false, retry: false }
  });

  async function onLoginWithAzure() {
    try {
      setStartAzureLogin(true);
      const { data } = await getAzureAuthenticationUrl();
      if (data?.url) {
        window.open(data.url, '_self');
      }
    } catch (error) {
      handleError({
        error,
        allDetailTypes: ['invalid_credential', 'user_already_logged_in'],
        alreadyHandledDetailTypes: ['invalid_credential'],
        nonDetail: { message: 'Login with Azure failed' },
      });
    }
  }

  useEffect(() => {
    if (code && state) {
      setStartAzureLogin(true)

      loginWithAzureMutation
        .mutateAsync({
          url: '/auth/azure/login',
          data: { code, state }
        }).then(() => {
          linkTo('/');
        });
    }
  }, [code, state]);

  useEffect(() => {
    AsyncStorage.getItem('rememberMe').then((email) => {
      setRememberedEmail(email ?? '');
      setIsRemembeerMe(!!email);
    });
  }, []);

  return (
    <Layout>
      <View className='w-full'>
        <View className='pb-7'>
          <Text className='text-center text-navi-text-bold text-4xl pb-4'>Welcome</Text>
          <Text className='text-center text-navi-text-meeker text-sm'>
            Use your email or another service to login {JSON.stringify(showPassword)}
          </Text>
        </View>

        <View className='flex flex-col gap-6'>
          <View className='flex flex-col gap-2'>
            <Controller
              name="email"
              control={form.control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative flex-row gap-2 items-center">
                  <Feather name="mail" size={20} color="#525252" className='absolute left-4 z-10' />
                  <TextInput
                    label="Email"
                    keyboardType="email-address"
                    className="flex-1 pl-7 text-base bg-transparent"
                    activeUnderlineColor="#4630EB"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {form.formState.errors.email && <Text className='text-red-500'>Email is required.</Text>}
          </View>

          <View className='flex flex-col gap-2'>
            <Controller
              name="password"
              control={form.control}
              rules={{ maxLength: 100, required: true }}
              render={({ field: { onChange, value } }) => (
                <View className="relative flex-row gap-2 items-center">
                  <Feather name="lock" size={22} color="#525252" className='absolute left-4 z-10' />
                  <TextInput
                    label="Password"
                    className="flex-1 pl-7 text-base bg-transparent"
                    activeUnderlineColor="#4630EB"
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
            {form.formState.errors.password && <Text className='text-red-500'>Password is required.</Text>}
          </View>

          <View className='flex-row pb-3'>
            <TouchableOpacity
              activeOpacity={1}
              className='flex-row items-center gap-3'
              onPress={() => onRememberMeChange(!isRemembeerMe)}
            >
              <Checkbox
                className='border'
                value={isRemembeerMe}
                onValueChange={onRememberMeChange}
                color={isRemembeerMe ? '#4630EB' : undefined}
              />
              <Text>Remember me</Text>
            </TouchableOpacity>
            <Link
              screen="ForgetPassword"
              params={{}}
              className='ml-auto underline'
              onPress={() => {
                loginMutation.reset()
                form.reset()
              }}
            >
              <Text className='text-indigo-600'>Forgot password?</Text>
            </Link>
          </View>

          <View className='flex-col gap-2'>
            <Button
              mode="contained"
              onPress={form.handleSubmit(onLogin)}
              disabled={!isValid || isSubmitting || isDisabled}
              buttonColor="#4630EB"
              className='py-1'
              loading={isSubmitting}
            >
              <Text className='text-white text-lg'>Login</Text>
            </Button>

            <View className='relative h-16'>
              <View className='absolute top-1/2 -translate-y-1/2 w-full h-px bg-neutral-500'></View>
              <Text className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white p-2 text-neutral-600 text-sm z-10'>Or Login with</Text>
            </View>

            <Button
              mode="outlined"
              onPress={onLoginWithAzure}
              className='py-0.5'
              loading={isAzureLoggingIn}
            >
              <View className='flex-row gap-2.5 items-center'>
                {!isAzureLoggingIn && <Image
                  source={require('../../../assets/images/azure.png')}
                  className='w-5 h-5'
                  resizeMode="contain"
                />}
                <Text className='text-lg'>Azure Login</Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </Layout>
  );
} 