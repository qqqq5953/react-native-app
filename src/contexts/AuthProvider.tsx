import { useLinkTo, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useGet, usePost } from '../lib/api';
import { handleError } from '../lib/helper/error';
import { AuthContext, User } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const route = useRoute();
  const linkTo = useLinkTo();

  const loginMutation = usePost<null, { email: string; password: string }>();
  const loginWithAzureMutation = usePost<null, { code: string; state: string }>();
  const logoutMutation = usePost<null, null>();
  const requestPasswordResetMutation = usePost<null, { email: string }>();
  const superLinkLoginMutation = usePost<null, { token: string }>();
  const resetPasswordMutation = usePost<null, { newPassword: string, confirmedPassword: string }>();
  const { refetch: getUser } = useGet<User>({
    url: '/user/me',
    queryKey: ['userMe'],
    options: { enabled: false, retry: false }
  });

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email: string, password: string): Promise<void> {
    await loginMutation.mutateAsync({
      url: '/auth/login',
      data: { email, password }
    });
  }

  async function loginWithAzure(code: string, state: string): Promise<void> {
    await loginWithAzureMutation.mutateAsync({
      url: '/auth/azure/login',
      data: { code, state }
    });
  }

  async function logout() {
    await logoutMutation.mutateAsync({
      url: '/auth/logout'
    });
    queryClient.removeQueries({ queryKey: ['userMe'] })
    setUser(null);
  }

  async function requestPasswordReset(email: string) {
    await requestPasswordResetMutation.mutateAsync({
      url: '/auth/forget-password',
      data: { email }
    });
  }

  async function superLinkLogin(token: string) {
    await superLinkLoginMutation.mutateAsync({
      url: `/auth/super-link-login?token=${token}`,
      config: {
        maxRedirects: 0 // Prevent automatic redirect following
      }
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

  useEffect(() => {
    const checkAuth = async () => {
      const publicPaths = [
        '/login',
        '/forget-password',
        '/reset-password',
        '/super-link-login',
        '/email-link-expired'
      ];
      const isPublicPath = publicPaths.includes(route.name);
      const isAuthenticated = localStorage.getItem('ia');
      if (isPublicPath) setIsLoading(isAuthenticated === 'true');

      const { data, error, isError } = await getUser();
      if (isError) {
        handleError({
          error,
          allDetailTypes: ['password_reset_required'],
          detailHandlers: {
            password_reset_required: () => {
              console.error('Password reset required');
              linkTo('/ResetPassword');
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
                linkTo('/Login');
                localStorage.removeItem('ia');
              }
            },
          }
        });
        setUser(null);
        localStorage.removeItem('ia');
      } else {
        localStorage.setItem('ia', data ? 'true' : 'false');
        setUser(data ?? null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [route.name]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginMutation,
        loginWithAzure,
        loginWithAzureMutation,
        requestPasswordReset,
        requestPasswordResetMutation,
        superLinkLogin,
        superLinkLoginMutation,
        resetPassword,
        resetPasswordMutation,
        logout,
        logoutMutation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}