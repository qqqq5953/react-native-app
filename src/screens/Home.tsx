import { usePost } from "@/lib/api";
import { useLinkTo } from "@react-navigation/native";
import { useQueryClient } from '@tanstack/react-query';
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const queryClient = useQueryClient()

  const linkTo = useLinkTo();
  const logoutMutation = usePost<null, null>();

  async function logout() {
    await logoutMutation.mutateAsync({
      url: '/auth/logout'
    });
    queryClient.removeQueries({ queryKey: ['userMe'] })
    // setUser(null);
  }

  async function handleLogout() {
    try {
      await logout();
      linkTo('/Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View className="flex flex-col items-center justify-center min-h-svh">
      <TouchableOpacity onPress={handleLogout}>
        <Text>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</Text>
      </TouchableOpacity>
      <View className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-md">

      </View>
    </View>
  )
}