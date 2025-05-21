import PickerLanguage from '@/components/common/LanguageMenu';
import { clsx } from 'clsx';
import React from 'react';
import { Image, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  containerClassName?: string;
}

export default function Layout({ children, containerClassName = "" }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-col min-h-screen bg-white" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className='grow flex-col w-full pt-10'>
          <View className={clsx(
            'flex flex-col items-center w-full pb-0 px-8',
            containerClassName
          )}>
            <Image
              source={require('../../../assets/images/NAVI-logo-dark.png')}
              className='h-12 mb-8 inline-block'
              resizeMode="contain"
            />
            {children}
          </View>
        </View>

        <View className='mt-auto'>
          <PickerLanguage />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
