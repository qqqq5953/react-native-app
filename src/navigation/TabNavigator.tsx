import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ForgetPassword from '../screens/auth/ForgetPassword';
import Login from '../screens/auth/Login';
import ResetPassword from '../screens/auth/ResetPassword';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="ForgetPassword" component={ForgetPassword} />
      <Tab.Screen name="ResetPassword" component={ResetPassword} />
    </Tab.Navigator>
  )
}
