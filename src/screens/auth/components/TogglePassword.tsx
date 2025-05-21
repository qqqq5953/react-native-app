import Octicons from '@expo/vector-icons/Octicons';
import { clsx } from "clsx";
import { Dispatch } from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  showPassword: boolean;
  setShowPassword: Dispatch<React.SetStateAction<boolean>>;
  showButton: boolean;
  setShowButton: Dispatch<React.SetStateAction<boolean>>;
}

export default function TogglePassword(props: Props) {
  return (
    <TouchableOpacity
      className={clsx(
        'absolute right-0 px-4 py-3 z-20',
        props.showButton ? 'block' : 'hidden',
      )}
      onPress={() => {
        props.setShowPassword(prev => !prev);
      }}
    >
      {props.showPassword
        ? <Octicons name="eye" size={22} color="#525252" />
        : <Octicons name="eye-closed" size={22} color="#525252" />}
    </TouchableOpacity>
  )
}
