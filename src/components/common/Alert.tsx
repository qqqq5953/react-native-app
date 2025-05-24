import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Octicons from "@expo/vector-icons/Octicons";
import clsx from "clsx";
import { Text, View } from "react-native";

type Props = {
  type: 'error' | 'success' | 'warning';
  message: string;
  className?: string;
}

const bgColor = {
  error: 'bg-red-100',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
}

export default function Alert(props: Props) {
  return (
    <View className={clsx(
      `flex-row items-center gap-3 rounded-xl p-4 ${bgColor[props.type]}`,
      props.className
    )}>
      <View className='text-navi-text-meek'>
        {props.type === 'error' && <Feather name="minus-circle" size={20} color="black" />}
        {props.type === 'success' && <Octicons name="check-circle" size={20} color="black" />}
        {props.type === 'warning' && <AntDesign name="warning" size={22} color="black" />}
      </View>
      <Text className='shrink text-sm'>
        {props.message}
      </Text>
    </View>
  )
}
