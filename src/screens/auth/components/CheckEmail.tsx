import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from '@react-navigation/native';
import { Dispatch, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Layout from '../Layout';
import BackToLogin from './BackToLogin';

type Props = {
  setEmail: Dispatch<React.SetStateAction<string>>
  email: string
}

export default function CheckEmail(props: Props) {
  // const { requestPasswordReset, requestPasswordResetMutation } = useAuth();

  const [countdown, setCountdown] = useState(30);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  async function handleResendEmail() {
    setCountdown(30);
    setIsButtonEnabled(false);
    try {
      // await requestPasswordReset(props.email)
    } catch (error) {
      // handleError({
      //   error,
      //   allDetailTypes: ['invalid_email', 'failed_to_deliver_email'],
      //   nonDetail: { message: 'Request password reset failed' },
      // });
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsButtonEnabled(true);
    }
  }, [countdown]);

  return (
    <Layout>
      <View className='flex-col items-center text-center pb-6'>
        <MaterialCommunityIcons name="email-fast-outline" size={64} color="black" />
        <Text className='text-navi-text-emphasis text-2xl font-medium pt-8 pb-4'>Check Your Email</Text>
        <View className='flex-col gap-1 text-navi-text-meek text-sm'>
          <Text className='text-center'>We have sent you an email at</Text>
          <Text className='text-center text-indigo-600 font-medium'>{props.email || 'test@gmail.com'}</Text>
          <Text className='text-center'>Please check your inbox to reset your password.</Text>
        </View>
      </View>

      <View className='w-full'>
        <TouchableOpacity
          className='flex justify-center items-center p-4 rounded-xl bg-indigo-600 disabled:opacity-50'
          onPress={handleResendEmail}
          disabled={!isButtonEnabled}
        >
          <Text className='text-white text-lg'>Resend email</Text>
        </TouchableOpacity>
        {countdown !== 0 && (
          <View className='flex-row gap-1 justify-center items-center text-navi-text-meek text-sm space-x-1 pt-4'>
            <Text>Didn&apos;t receive the email?</Text>
            <Text>Resend in</Text>
            <Text className='font-semibold'>{countdown}s</Text>
          </View>
        )}
        <View className='flex-row gap-1 justify-center items-center text-navi-text-meek text-sm space-x-1 pt-5 pb-4'>
          <Text className='text-navi-text-meek text-sm '>Wrong email address?</Text>
          <Link
            screen="ForgetPassword"
            params={{}}
            className='text-navi-textPrimary-default px-0 hover:underline font-normal'
            onPress={() => {
              props.setEmail('')
            }}
          >
            <Text>Change email address</Text>
          </Link>
        </View>
        <BackToLogin />
      </View>
    </Layout>
  );
}
