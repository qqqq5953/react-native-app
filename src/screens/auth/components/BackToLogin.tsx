import { Link, useLinkTo } from '@react-navigation/native';
import { Text, View } from 'react-native';

type Props = {
  onPress?: () => Promise<void> | void;
}

export default function BackToLogin(props: Props) {
  const link = useLinkTo();

  return (
    <View className='flex-row gap-1 mx-auto text-center space-x-1 font-medium'>
      <Text className='text-navi-text-meek'>Back to</Text>
      <Link
        screen="Login"
        params={{}}
        onPress={async (e) => {
          if (props.onPress) {
            e.preventDefault();
            await props.onPress();
            link('/Login');
          }
        }}
      >
        <Text className='underline text-indigo-600'>Login</Text>
      </Link>
    </View>
  )
}
