import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLinkTo } from '@react-navigation/native';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import BackToLogin from './components/BackToLogin';
import CheckEmail from './components/CheckEmail';
import Layout from './Layout';
const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgetPassword() {
  const linkTo = useLinkTo();
  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange"
  })

  const onSubmit = ({ email }: z.infer<typeof formSchema>) => {
    setEmail(email)
    form.reset()
  }

  return (
    <>
      {
        email ? (
          <CheckEmail
            email={email}
            setEmail={setEmail}
          />
        ) : (
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
                    control={form.control}
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
                  {form.formState.errors.email && <Text className='text-red-500'>Email is required.</Text>}
                </View>

                <TouchableOpacity onPress={form.handleSubmit(onSubmit)} className='flex justify-center items-center p-4 rounded-xl bg-indigo-600'>
                  <Text className='text-white text-lg'>Send email</Text>
                </TouchableOpacity>

                <BackToLogin />
              </View>
            </View>
          </Layout>
        )
      }
    </>
  );
} 