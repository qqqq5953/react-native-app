import { handleError } from "@/lib/helper/error";
import { useLinkTo } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { usePost } from "../../lib/api";
import NotFound from "../NotFound";
import Layout from "./Layout";

export default function RedirectFromEmail() {
  const linkTo = useLinkTo();
  const superLinkLoginMutation = usePost<null, { token: string }>();
  const token = "1234567890";

  const [isNotFound, setIsNotFound] = useState(false);
  const [isSuperLinkExpired, setIsSuperLinkExpired] = useState(true);

  async function superLinkLogin(token: string) {
    await superLinkLoginMutation.mutateAsync({
      url: `/auth/super-link-login?token=${token}`,
      config: {
        maxRedirects: 0 // Prevent automatic redirect following
      }
    });
  }

  useEffect(() => {
    if (!token) return
    handleSuperLinkLogin(token);

    async function handleSuperLinkLogin(token: string) {
      try {
        await superLinkLogin(token);
        linkTo('/ResetPassword');
      } catch (error) {
        handleError({
          error,
          allDetailTypes: ['super_link_expired', 'super_link_not_found', 'user_already_logged_in'],
          detailHandlers: {
            super_link_expired: () => setIsSuperLinkExpired(true),
            super_link_not_found: () => setIsNotFound(true),
            user_already_logged_in: () => linkTo('/')
          },
          nonDetail: { message: 'Super link login failed' },
        });
      }
    }
  }, [token])

  if (!token || isNotFound) return <NotFound />

  if (isSuperLinkExpired) {
    return (
      <Layout>
        <View className='flex flex-col items-center text-center pb-6'>
          <Image
            source={require('../../../assets/images/link.png')}
            className='h-12 mb-8 inline-block'
            resizeMode="contain"
          />
          <Text className='text-navi-text-emphasis text-2xl pb-4 font-medium'>Link Expired</Text>
          <View className='flex-col text-navi-text-meek'>
            <Text className="text-center">The password reset link is no longer valid.</Text>
            <Text className="text-center">It may have expired or has already been used.</Text>
            <Text className="text-center pt-6">Return to the login page to request a new link.</Text>
          </View>
        </View>

        <TouchableOpacity
          className='flex justify-center items-center p-4 rounded-xl bg-indigo-600 w-full'
          onPress={() => {
            linkTo('/Login')
            setIsSuperLinkExpired(false);
          }}
        >
          <Text className='text-white text-lg'>Back to login</Text>
        </TouchableOpacity>
      </Layout>
    );
  }

  return null;
}
