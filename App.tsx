import { View, Text,SafeAreaView } from 'react-native'
import React from 'react'
import Config from "react-native-config";

export default function App() {
  console.log("wdwd",Config)
  return (
    <SafeAreaView>
      <Text>{`${Config.API_URL}`}</Text>
      </SafeAreaView>
  )
}