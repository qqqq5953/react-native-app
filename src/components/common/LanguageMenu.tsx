import { useLanguageState } from "@/store/languageStore";
import { useState } from "react";
import { View } from "react-native";
// import { Button, Menu } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Button, Menu, Modal, Portal, Text } from 'react-native-paper';


export default function PickerLanguage() {
  const [visible, setVisible] = useState(false);
  const { language, setLanguage } = useLanguageState();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20, borderRadius: 16, margin: 20 };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Menu.Item
            title="English"
            titleStyle={{ color: language.value === "en" ? "#4630EB" : "black" }}
            onPress={() => {
              hideModal()
              setLanguage({ label: "English", value: "en" })
            }}
          />
          <Menu.Item
            title="Traditional Chinese"
            titleStyle={{ color: language.value === "zh-TW" ? "#4630EB" : "black" }}
            onPress={() => {
              hideModal()
              setLanguage({ label: "Traditional Chinese", value: "zh-TW" })
            }}
          />
          <Menu.Item
            title="Simplified Chinese"
            titleStyle={{ color: language.value === "zh-CN" ? "#4630EB" : "black" }}
            onPress={() => {
              hideModal()
              setLanguage({ label: "Simplified Chinese", value: "zh-CN" })
            }}
          />
        </Modal>
      </Portal>
      <Button style={{ marginTop: 30 }} onPress={showModal}>
        <View className="flex-row items-center gap-2">
          <SimpleLineIcons name="globe" size={18} color="black" />
          <Text className="text-neutral-700">{language.label}</Text>
          <Entypo name="chevron-small-down" size={24} color="black" />
        </View>
      </Button>
    </View>
  );
}
