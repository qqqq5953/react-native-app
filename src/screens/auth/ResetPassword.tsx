import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from 'react-native';
import { z } from "zod";
import { Input } from '../../components/ui/input';
import { RootStackParamList } from '../../navigation/AppNavigator';
import BackToLogin from './components/BackToLogin';
import PasswordRequirement from './components/PasswordRequirement';
import TogglePassword from './components/TogglePassword';
import Layout from './Layout';
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

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
  const navigation = useNavigation<LoginScreenNavigationProp>();

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

  const onSubmit = (data: any) => {
    navigation.navigate('Login');
    console.log(data)
  }

  return (
    <Layout>
      <View className='w-full'>
        <View className='pb-7'>
          <Text className='text-center text-navi-text-bold text-4xl pb-4'>Reset Password</Text>
          <Text className='text-center text-navi-text-meeker text-sm mx-10'>
            Enter a new password below to change your password. {password} / {JSON.stringify(passwordValidation.hasNumber)}
          </Text>
        </View>

        <View className='flex flex-col gap-6'>
          <View className='flex flex-col gap-2'>
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <View className="relative flex-row gap-2 items-center border-b border-navi-border-muted px-2">
                  <Feather name="lock" size={20} color="black" />
                  <Input
                    placeholder="New Password"
                    className="flex-1 py-4 rounded-none shadow-none border-0
                  focus:border-0 placeholder:text-base placeholder:text-navi-text-meeker"
                    value={field.value}
                    secureTextEntry={!showPassword}
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
            <View
              className={`flex flex-col gap-1 ${shouldShowRequirements ? 'opacity-100 translate-y-2' : 'opacity-0 translate-y-0 h-0'}`}
            >
              <PasswordRequirement text="Only contain letters, numbers and symbols" isValid={passwordValidation.hasValidChars} />
              <PasswordRequirement text="At least one number" isValid={passwordValidation.hasNumber} />
              <PasswordRequirement text="6-18 characters" isValid={passwordValidation.length} />
              <PasswordRequirement text="Includes both lower and upper case letters" isValid={passwordValidation.hasLowercase && passwordValidation.hasUppercase} />
            </View>
          </View>

          <View className='flex flex-col gap-2'>
            <Controller
              name="confirmedPassword"
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <View className="flex-row gap-2 items-center border-b border-navi-border-muted px-2">
                  <Feather name="lock" size={20} color="black" />
                  <Input
                    placeholder="Confirm New Password"
                    className="flex-1 py-4 rounded-none shadow-none border-0
                  focus:border-0 placeholder:text-base placeholder:text-navi-text-meeker"
                    value={field.value}
                    secureTextEntry={!showConfirmPassword}
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

          <TouchableOpacity
            onPress={form.handleSubmit(onSubmit)}
            className='flex justify-center items-center p-4 rounded-xl bg-indigo-600 disabled:opacity-85'
            disabled={!isValid || isSubmitting}
          >
            <Text className='text-white text-lg'>Reset password</Text>
          </TouchableOpacity>
          <BackToLogin />
        </View>
      </View>
    </Layout>
  );
} 