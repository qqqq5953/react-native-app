import useAuth from '@/hooks/useAuth';
import { useLinkTo } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const NotFound: React.FC = () => {
  const linkTo = useLinkTo();
  const { isAuthenticated } = useAuth();

  return (
    <View className='flex flex-col justify-center items-center h-screen gap-4 bg-navi-surface p-4 sm:px-10'>
      <View className='flex flex-col items-center'>
        <Image
          source={require('../../assets/images/404.png')}
          className='w-80 h-[400px]'
          resizeMode="contain"
        />
        <View className='flex flex-col items-center gap-4'>
          <Text className='mt-4 text-4xl font-medium'>Page Not Found</Text>
          <Text className='text-navi-text-meeker text-sm'>Oops! The page you’re looking for doesn’t exist.</Text>
          <View className='mt-12'>
            {isAuthenticated
              ? (
                <TouchableOpacity
                  onPress={() => linkTo('/')}
                  className='flex justify-center items-center p-4 rounded-xl border'
                >
                  <Text>Back to Home</Text>
                </TouchableOpacity>
              )
              : (
                <TouchableOpacity
                  onPress={() => linkTo('/Login')}
                  className='flex justify-center items-center p-4 rounded-xl border'
                >
                  <Text>Back to Login</Text>
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </View>
    </View>
  );
};

export default NotFound;