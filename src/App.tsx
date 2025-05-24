import TabNavigator from '@/navigation/TabNavigator';
// import { AppNavigator } from '@/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { AppStateStatus, Platform } from 'react-native';

import { useAppState } from './hooks/useAppState';
import { useOnlineManager } from './hooks/useOnlineManager';

import { useUserStore } from '@/store/userStore';
import { User } from '@/types/user';
import { PaperProvider } from 'react-native-paper';
import "./global.css";
import './global.cssInterop';
import { fetcher } from './lib/api';
import { handleError } from './lib/helper/error';


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
  // const linkTo = useLinkTo();

  async function checkAuth(currentRoute: string) {
    try {
      const user = await fetcher.get<User>('/user/me')
      setUser(user ?? null);
      // await AsyncStorage.setItem('ia',  user ? 'true' : 'false');
    } catch (error) {
      console.log('checkAuth error', error);
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
            handler: (status) => {
              if (status === 403) {
                console.error('Forbidden');
                const pathToSkipRedirect = [
                  '/login',
                  '/redirect',
                  '/forget-password',
                  '/super-link-login'
                ]
                const isSkipPath = pathToSkipRedirect.includes(currentRoute);
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
    console.log('onStateChange', state);
    if (state) {
      checkAuth(state.routes[state.index].name);
    }
  }

  return (
    <PaperProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer onStateChange={onStateChange}>
          {/* <AppNavigator /> */}
          <TabNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </PaperProvider>
  )
} 