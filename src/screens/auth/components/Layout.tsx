import { clsx } from 'clsx';
import React from 'react';
import { Image, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import PickerLanguage from '../../../components/common/PickerLanguage';

type Props = {
  children: React.ReactNode;
  containerClassName?: string;
}

export default function Layout({ children, containerClassName = "" }: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex flex-col min-h-screen bg-navi-surfaceLilac-subtle col-span-1">
        <View className='grow flex justify-center w-full'>
          <View className={clsx(
            'flex flex-col items-center w-full pb-9 px-9 pt-14',
            containerClassName
          )}>
            <Image
              source={require('../../../../assets/images/NAVI-logo-dark.png')}
              className='h-12 mb-8 inline-block'
              resizeMode="contain"
            />
            {children}
          </View>
        </View>

        <View className='flex items-center justify-center mt-auto py-4'>
          <PickerLanguage />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
