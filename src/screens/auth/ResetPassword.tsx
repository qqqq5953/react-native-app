import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../../components/ui/input';
import { RootStackParamList } from '../../navigation/AppNavigator';
import BackToLogin from './components/BackToLogin';
import Layout from './components/Layout';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPassword() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmedPassword: "",
    },
  })

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
            Enter a new password below to change your password.
          </Text>
        </View>

        <View className='flex flex-col gap-6'>
          <View className='flex flex-col gap-2'>
            <Controller
              name="newPassword"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex-row gap-2 items-center border-b border-navi-border-muted px-2">
                  <Feather name="lock" size={20} color="black" />
                  <Input
                    placeholder="New Password"
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
            {errors.newPassword && <Text className='text-red-500'>New password is required.</Text>}
          </View>

          <View className='flex flex-col gap-2'>
            <Controller
              name="confirmedPassword"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex-row gap-2 items-center border-b border-navi-border-muted px-2">
                  <Feather name="lock" size={20} color="black" />
                  <Input
                    placeholder="Confirm New Password"
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
            {errors.confirmedPassword && <Text className='text-red-500'>Passwords do not match</Text>}
          </View>

          <TouchableOpacity onPress={handleSubmit(onSubmit)} className='flex justify-center items-center p-4 rounded-xl bg-indigo-600'>
            <Text className='text-white text-lg'>Reset password</Text>
          </TouchableOpacity>
          <BackToLogin />
        </View>
      </View>
    </Layout>
  );
} 