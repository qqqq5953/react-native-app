import { Text, View } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';

import { useSnackbarStore } from '@/store/snackbarStore';

export default function NaviSnackbar() {
  const { snackbar, setSnackbar } = useSnackbarStore();

  return (
    <Portal>
      <Snackbar
        visible={snackbar.visible}
        duration={3000}
        icon="close-circle"
        onIconPress={() => setSnackbar({ ...snackbar, visible: false })}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        style={{ borderRadius: 20, paddingRight: 8 }}
      >
        <View className="flex-col gap-2">
          <View className="flex-row items-center gap-3 ">
            <View className='shrink-0 '>
              {snackbar.variant === "desc" && <Octicons name="info" size={22} color="white" />}
              {snackbar.variant === "info" && <FontAwesome6 name="circle-info" size={21.3} color="#2563eb" />}
              {snackbar.variant === "success" && <Octicons name="check-circle-fill" size={22} color="#16a34a" />}
              {snackbar.variant === "warning" && <FontAwesome6 name="triangle-exclamation" size={21.2} color="#fbbf24" />}
              {snackbar.variant === "error" && <AntDesign name="closecircle" size={22.2} color="#dc2626" />}
            </View>
            <Text className='text-white'>{snackbar.title}</Text>
          </View>
          {snackbar.message && <Text className="text-sm text-neutral-200">{snackbar.message}</Text>}
        </View>
      </Snackbar>
    </Portal>
  )
}
