import Feather from '@expo/vector-icons/Feather';
import { useLinkTo } from '@react-navigation/native';
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../../components/ui/input';
import BackToLogin from './components/BackToLogin';
import Layout from './Layout';

export default function ForgetPassword() {
  const linkTo = useLinkTo();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data: any) => {
    linkTo('/ResetPassword')
    console.log(data)
  }

  return (
    <Layout>
      <View className='w-full'>
        <View className='pb-7'>
          <Text className='text-center text-navi-text-bold text-4xl pb-4'>Forget Password</Text>
          <Text className='text-center text-navi-text-meeker text-sm'>
            Enter your email so that we can send you password reset link
          </Text>
        </View>

        <View className='flex flex-col gap-6'>
          <View className='flex flex-col gap-2'>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
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

          <TouchableOpacity onPress={handleSubmit(onSubmit)} className='flex justify-center items-center p-4 rounded-xl bg-indigo-600'>
            <Text className='text-white text-lg'>Send email</Text>
          </TouchableOpacity>

          <BackToLogin />
        </View>
      </View>
    </Layout>
  );
} 