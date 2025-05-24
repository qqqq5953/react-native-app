import { AppRegistry } from "react-native";
import appJson from "./app.json";
import App from "./src/App";

async function enableMocking() {
  if (!__DEV__) {
    return;
  }

  await import("./msw.polyfills");
  const { server } = await import("./src/mocks/server");
  server.listen();
}

enableMocking().then(() => {
  AppRegistry.registerComponent(appJson.expo.name, () => App);
});

export default App;
