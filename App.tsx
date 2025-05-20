import TabNavigator from '@/navigation/TabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { AppStateStatus, Platform } from 'react-native';

import { useAppState } from './src/hooks/useAppState';
import { useOnlineManager } from './src/hooks/useOnlineManager';

import { useUserStore } from '@/store/userStore';
import { User } from '@/types/user';
import "./src/global.css";
import api from "./src/lib/api/axios";
import { handleError } from './src/lib/helper/error';

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  useOnlineManager()
  useAppState(onAppStateChange)

  const { setUser } = useUserStore();

  async function checkAuth(currentRoute: string) {
    try {
      const result = await api.get<User>('/user/me')
      console.log('result', result);

      // await AsyncStorage.setItem('ia', data ? 'true' : 'false');
      // setUser(data ?? null);
    } catch (error) {
      console.log('error', error);

      setUser(null);
      await AsyncStorage.removeItem('ia');
      const test = false;
      if (test) {
        handleError({
          error,
          allDetailTypes: ['password_reset_required'],
          detailHandlers: {
            password_reset_required: () => {
              console.error('Password reset required');
              // linkTo('/ResetPassword');
            }
          },
          nonDetail: {
            handler: (axiosError) => {
              const status = axiosError.response?.status;
              if (status === 403) {
                console.error('Invalid credential');
                const pathToSkipRedirect = [
                  '/forget-password',
                  '/login',
                  '/super-link-login'
                ]
                const isSkipPath = pathToSkipRedirect.includes(location.pathname);
                if (isSkipPath) return;

                console.log('403 navigate to login');
                // linkTo('/Login');
                localStorage.removeItem('ia');
              }
            },
          }
        });
      }
    }
  };

  function onStateChange(state: NavigationState | undefined) {
    // console.log('onStateChange', state);
    if (state) {
      // checkAuth(state.routes[state.index].name);
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer onStateChange={onStateChange}>
        {/* <AppNavigator /> */}
        <TabNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  )
} 