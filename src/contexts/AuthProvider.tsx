import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode, useEffect, useState } from 'react';
import { AuthContext, User } from '../contexts/AuthContext';
import { useGet, usePost } from '../lib/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = usePost<{ token: string }, { email: string; password: string }>();
  const logoutMutation = usePost<null, null>();
  const requestPasswordResetMutation = usePost<null, { email: string }>();
  const resetPasswordMutation = usePost<null, { newPassword: string, confirmedPassword: string }>();
  const { refetch: getUser } = useGet<User>({
    url: '/user/me',
    queryKey: ['userMe'],
    options: { enabled: false }
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const userResponse = await getUser();
        setUser(userResponse.data ?? null);
      } catch (error) {
        console.log('checkAuth error', error);
        await AsyncStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  async function login(email: string, password: string): Promise<void> {
    const response = await loginMutation.mutateAsync({
      url: '/auth/login',
      data: { email, password }
    });

    await AsyncStorage.setItem('token', response.token);

    const userResponse = await getUser();
    const user = userResponse.data;
    setUser(user ?? null);
  }
  // Logout function
  async function logout() {
    await logoutMutation.mutateAsync({
      url: '/auth/logout'
    });
    await AsyncStorage.removeItem('token');
    setUser(null);
  }

  // Request password reset function
  async function requestPasswordReset(email: string) {
    await requestPasswordResetMutation.mutateAsync({
      url: '/auth/forget-password',
      data: { email }
    });
  }

  async function resetPassword(newPassword: string, confirmedPassword: string) {
    await resetPasswordMutation.mutateAsync({
      url: '/auth/reset-password',
      data: {
        newPassword,
        confirmedPassword
      }
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginMutation,
        logoutMutation,
        requestPasswordResetMutation,
        resetPasswordMutation,
        logout,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 