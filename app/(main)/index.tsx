import { useQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import axiosInstance from '../../lib/axios'

interface Post {
  id: number
  title: string
  body: string
}

export default function Home() {
  const { data, isLoading, error } = useQuery<Post>({
    queryKey: ['post'],
    queryFn: async () => {
      const response = await axiosInstance.get('/posts/1')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        {data?.title}
      </Text>
      <Text style={{ fontSize: 16 }}>{data?.body}</Text>
      <Link href="/login">Login</Link>
    </View>
  )
}
