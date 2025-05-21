import { cssInterop } from "nativewind";
import { Button, TextInput } from "react-native-paper";

cssInterop(TextInput, {
  className: "style",
  styleProperty: "style",
});

cssInterop(Button, {
  className: "style",
  styleProperty: "style",
});
