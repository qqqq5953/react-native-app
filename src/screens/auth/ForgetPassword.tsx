import ErrorMessage from '@/components/common/ErrorMessage';
import { usePost } from '@/lib/api';
import { handleError } from '@/lib/helper/error';
import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { z } from 'zod';
import BackToLogin from './components/BackToLogin';
import CheckEmail from './components/CheckEmail';
import Layout from './Layout';

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const requestPasswordResetMutation = usePost<null, { email: string }>();
  async function requestPasswordReset(email: string) {
    await requestPasswordResetMutation.mutateAsync({
      url: '/auth/forget-password',
      data: { email }
    });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange"
  })

  const { isValid, isSubmitting } = form.formState;
  const isError = !!form.formState.errors.email || requestPasswordResetMutation.isError

  async function onSubmit({ email }: z.infer<typeof formSchema>) {
    try {
      await requestPasswordReset(email)
      setEmail(email)
      form.reset()
    } catch (error) {
      setIsDisabled(true)
      handleError({
        error,
        allDetailTypes: ['invalid_email', 'failed_to_deliver_email'],
        alreadyHandledDetailTypes: ['invalid_email', 'failed_to_deliver_email'],
        nonDetail: { message: 'Request password reset failed' },
      });
    }
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
                <Text className='text-center text-navi-text-meeker text-sm px-4'>
                  Enter your email so that we can send you password reset link
                </Text>
              </View>

              <View className='flex flex-col gap-6'>
                <View className='flex flex-col gap-2'>
                  <Controller
                    name="email"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <View className="relative flex-row gap-2 items-center">
                        <Feather name="mail" size={20} color="#525252" className='absolute left-4 z-10 mt-1' />
                        <TextInput
                          label={
                            <Text className='text-neutral-500'>
                              Email
                            </Text>
                          }
                          keyboardType="email-address"
                          className="flex-1 pl-8 text-base bg-transparent"
                          activeUnderlineColor={isError ? '#ef4444' : '#4630EB'}
                          underlineColor={isError ? '#ef4444' : '#525252'}
                          textColor={isError ? '#ef4444' : '#525252'}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChangeText={(e) => {
                            field.onChange(e);
                            setIsDisabled(false)
                            requestPasswordResetMutation.reset()
                          }}
                        />
                      </View>
                    )}
                  />
                  {form.formState.errors.email && <Text className='text-red-500'>{form.formState.errors.email.message}</Text>}
                  <ErrorMessage mutation={requestPasswordResetMutation} />
                </View>

                <Button
                  mode="contained"
                  onPress={form.handleSubmit(onSubmit)}
                  disabled={!isValid || isSubmitting || isDisabled}
                  buttonColor="#4630EB"
                  className='py-1'
                  labelStyle={{ width: '100%' }}
                  loading={isSubmitting}
                >
                  <Text className='text-white text-lg'>Send email</Text>
                </Button>

                <BackToLogin onPress={() => {
                  requestPasswordResetMutation.reset();
                  form.clearErrors();
                  form.reset();
                }} />
              </View>
            </View>
          </Layout>
        )
      }
    </>
  );
} 