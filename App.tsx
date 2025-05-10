import { NavigationContainer } from '@react-navigation/native'
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query'
import { AppStateStatus, Platform } from 'react-native'

import { useAppState } from './src/hooks/useAppState'
import { useOnlineManager } from './src/hooks/useOnlineManager'
import { AppNavigator } from './src/navigation/AppNavigator'

import "./src/global.css"

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

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  )
} 