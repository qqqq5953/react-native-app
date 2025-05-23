import { useSnackbarStore } from '@/store/snackbarStore';
import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinkTo } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Animated, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { z } from "zod";
import { usePost } from '../../lib/api';
import { handleError } from '../../lib/helper/error';
import BackToLogin from './components/BackToLogin';
import PasswordRequirement from './components/PasswordRequirement';
import TogglePassword from './components/TogglePassword';
import Layout from './Layout';

const formSchema = z
  .object({
    newPassword: z.string()
      .min(6, "Password must be at least 6 characters")
      .max(18, "Password must not exceed 18 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/^[!-~]+$/, "Password can only contain letters, numbers and symbols"),
    confirmedPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

export default function ResetPassword() {
  const linkTo = useLinkTo();
  const { setSnackbar } = useSnackbarStore();

  const resetPasswordMutation = usePost<null, { newPassword: string, confirmedPassword: string }>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shouldShowRequirements, setShouldShowRequirements] = useState(false);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const [showConfirmPasswordToggle, setShowConfirmPasswordToggle] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmedPassword: "",
    },
    mode: "onChange"
  });
  const { isValid, isSubmitting } = form.formState;

  const password = form.watch("newPassword");
  const passwordValidation = {
    length: password.length >= 6 && password.length <= 18,
    hasNumber: /[0-9]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasValidChars: password.length > 0 ? /^[!-~]+$/.test(password) : false,
  };

  async function resetPassword(newPassword: string, confirmedPassword: string) {
    await resetPasswordMutation.mutateAsync({
      url: '/auth/reset-password',
      data: {
        newPassword,
        confirmedPassword
      }
    });
  }

  async function onSubmit({ newPassword, confirmedPassword }: z.infer<typeof formSchema>) {
    try {
      await resetPassword(newPassword, confirmedPassword);
      setSnackbar({
        visible: true,
        variant: "success",
        title: "Password reset successful",
        message: "Use your new password to login",
      })
      linkTo('/Login');
    } catch (error) {
      handleError({
        error,
        allDetailTypes: ['password_confirm_error'],
        nonDetail: { message: 'Password reset failed' }
      });
    }
  }

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: shouldShowRequirements ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: shouldShowRequirements ? 8 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [shouldShowRequirements]);

  return (
    <Layout>
      <View className='w-full'>
        <View className='pb-7'>
          <Text className='text-center text-navi-text-bold text-4xl pb-4'>Reset Password</Text>
          <Text className='text-center text-navi-text-meeker text-sm mx-10'>
            Enter a new password below to change your password.
          </Text>
        </View>

        <View className='flex flex-col gap-6'>
          <View className='flex flex-col gap-2'>
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <View className="relative flex-row gap-2 items-center">
                  <Feather name="lock" size={20} color="#525252" className='absolute left-4 z-10' />
                  <TextInput
                    label={
                      <Text className='text-neutral-500'>
                        New Password
                      </Text>
                    }
                    className="flex-1 pl-7 text-base bg-transparent"
                    activeUnderlineColor={form.formState.errors.newPassword ? '#525252' : '#4630EB'}
                    underlineColor={form.formState.errors.newPassword ? '#525252' : '#525252'}
                    textColor={form.formState.errors.newPassword ? '#525252' : '#525252'}
                    secureTextEntry={!showPassword}
                    value={field.value}
                    onChangeText={(e) => {
                      field.onChange(e);
                      const newPassword = form.getValues('newPassword');
                      const confirmedPassword = form.getValues('confirmedPassword');
                      if (newPassword === confirmedPassword) {
                        form.clearErrors('confirmedPassword');
                      } else if (newPassword !== '' && confirmedPassword !== '') {
                        form.setError('confirmedPassword', { message: 'Passwords do not match' });
                      }
                    }}
                    onFocus={() => {
                      setShouldShowRequirements(true);
                      setShowPasswordToggle(true);
                    }}
                    onBlur={() => {
                      setShouldShowRequirements(false);
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
            <View className={`${shouldShowRequirements ? 'h-auto' : 'h-0'}`}>
              <Animated.View
                style={{
                  opacity,
                  transform: [{ translateY }],
                }}
                className="flex flex-col gap-1"
              >
                <PasswordRequirement text="Only contain letters, numbers and symbols" isValid={passwordValidation.hasValidChars} />
                <PasswordRequirement text="At least one number" isValid={passwordValidation.hasNumber} />
                <PasswordRequirement text="6-18 characters" isValid={passwordValidation.length} />
                <PasswordRequirement text="Includes both lower and upper case letters" isValid={passwordValidation.hasLowercase && passwordValidation.hasUppercase} />

              </Animated.View>
            </View>
          </View>

          <View className='flex flex-col gap-2'>
            <Controller
              name="confirmedPassword"
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <View className="flex-row gap-2 items-center">
                  <Feather name="lock" size={20} color="#525252" className='absolute left-4 z-10' />
                  <TextInput
                    label={
                      <Text className='text-neutral-500'>
                        Confirm New Password
                      </Text>
                    }
                    className="flex-1 pl-7 text-base bg-transparent"
                    activeUnderlineColor={form.formState.errors.confirmedPassword ? '#ef4444' : '#4630EB'}
                    underlineColor={form.formState.errors.confirmedPassword ? '#ef4444' : '#525252'}
                    textColor={form.formState.errors.confirmedPassword ? '#ef4444' : '#525252'}
                    secureTextEntry={!showConfirmPassword}
                    value={field.value}
                    onChangeText={(e) => {
                      field.onChange(e);
                      if (form.getValues('newPassword') === form.getValues('confirmedPassword')) {
                        form.clearErrors('confirmedPassword');
                      }
                    }}
                    onFocus={() => {
                      setShowConfirmPasswordToggle(true);
                    }}
                    onBlur={() => {
                      setShowConfirmPasswordToggle(false);
                    }}
                  />
                  <TogglePassword
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                    showButton={showConfirmPasswordToggle}
                    setShowButton={setShowConfirmPasswordToggle}
                  />
                </View>
              )}
            />
            {form.formState.errors.confirmedPassword && <Text className='text-red-500'>Passwords do not match</Text>}
          </View>

          <Button
            mode="contained"
            onPress={form.handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            buttonColor="#4630EB"
            className='py-1'
            loading={isSubmitting}
          >
            <Text className='text-white text-lg'>Reset password</Text>
          </Button>
          <BackToLogin />
        </View>
      </View>
    </Layout>
  );
} 