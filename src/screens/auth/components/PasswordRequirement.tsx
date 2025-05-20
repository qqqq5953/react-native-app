import Feather from '@expo/vector-icons/Feather';
import { Text, View } from 'react-native';

type PasswordRequirementProps = {
  text: string;
  isValid: boolean;
}

export default function PasswordRequirement(props: PasswordRequirementProps) {
  return (
    <View className={`flex-row items-center gap-2`}>
      <Feather name="check" size={24} color={props.isValid ? '#22c55e' : ''} />
      <Text className={`text-sm ${props.isValid ? 'text-green-500' : ''}`}>{props.text}</Text>
    </View>
  )
}