import { View, Text, Button } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { removeTokenFromKeychain } from '../../../app/keychain';
import { logout } from '../../../features/auth/authSlice';
import { useAppDispatch } from '../../../app/hooks';
import { TokenService } from '../../../services/storage/keychain.services';
export default function HomeScreen() {
  const dispatch = useAppDispatch();
  //   async function Savetoken(){
  // await TokenService.save("EDEDE")
  //   }
  async function Gettoken() {
    let mytoken = await TokenService.get();
    alert(mytoken)
  }
  async function Removetoken() {
    dispatch(logout());
    // await removeTokenFromKeychain();
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        <Text>HomeScreen</Text>
        {/* <Button onPress={Savetoken} title="SaveValue" />

        <Button onPress={Gettoken} title="GetValue" /> */}
        <Button onPress={Removetoken} title="RemoveValue" />

        <Button onPress={Gettoken} title="GetValue" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
