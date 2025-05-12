import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import useAuth from '../hooks/useAuth';
import ChatPage from '../screens/ChatPage';
import ForgetPassword from '../screens/auth/ForgetPassword';
import Login from '../screens/auth/Login';
import ResetPassword from '../screens/auth/ResetPassword';

export type RootStackParamList = {
  Login: undefined;
  ForgetPassword: undefined;
  ResetPassword: undefined;
  ChatPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  // const { isAuthenticated, isLoading, user } = useAuth();


  // if (isLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ChatPage" component={ChatPage} />

      {/* {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        </>
      ) : user?.isRequiredPasswordChange ? (
        // Reset Password Stack
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      ) : (
        // Protected Stack
        <Stack.Screen name="ChatPage" component={ChatPage} />
      )} */}
    </Stack.Navigator>
  );
} 