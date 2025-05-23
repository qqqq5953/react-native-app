import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  message: string
}

export function ErrorMessage({ message }: Props) {
  return (
    <View style={styles.fill}>
      <Text>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})