import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
export default function SettingScreen() {
  return (
 <SafeAreaProvider>
       
       <SafeAreaView
         edges={['top', 'left', 'right']}
         style={{ flex: 1, paddingHorizontal: 16 }}
       >
         <Text>SettingScreen</Text>
       </SafeAreaView>
     </SafeAreaProvider>
  );
}
