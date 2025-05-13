import { Link } from '@react-navigation/native'
import { Text, View } from 'react-native'

export default function BackToLogin() {
  return (
    <View className='flex-row justify-center gap-2 space-x-1 font-medium w-1/2 mx-auto'>
      <Text className='text-navi-text-meek font-medium'>Back to</Text>
      <Link screen="Login" params={{}} className='text-navi-textPrimary-default underline' style={{ fontWeight: 'bold' }}>Login</Link>
    </View>
  )
}