import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function PickerLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <View className="w-48 border border-gray-300 rounded-lg overflow-hidden">
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
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