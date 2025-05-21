import { useLanguageState } from '@/store/languageStore';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';

export default function PickerLanguage() {
  const { language, setLanguage } = useLanguageState();


  return (
    <View className="w-48 rounded-lg overflow-hidden">
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => setLanguage(itemValue)}
        dropdownIconColor="#000"
        mode="dropdown"
        itemStyle={{
          fontSize: 16,
          color: '#000',
        }}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Traditional Chinese" value="zh-TW" />
        <Picker.Item label="Simplified Chinese" value="zh-CN" />
      </Picker>
    </View>
  );
}