import { Text, Button, Alert, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { saveTokenToKeychain } from '../../app/keychain';
import { useLoginMutation } from '../../features/auth/authApi';
export default function LoginScreen() {
  const [login, { data, isLoading, isError, status }] = useLoginMutation();

  const handleLogin = async () => {
    const res = await login({
      email: 'abhay@gmail.com',
      password: '#Abhay12345',
    }).unwrap();
    // Alert.alert('Login Response:', data?.success);
    alert(status);
    // Save token + user to Keychain
    await saveTokenToKeychain(res.access_token, res.user);
  };

  // async function Savetoken() {
  //   await saveTokenToKeychain('MyToken123');
  // }
  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        <Text>LoginScreen</Text>
        {isError && (
          <Text style={{ color: isError ? 'red' : '' }}>
            Invalid Credential
          </Text>
        )}
        <Button onPress={handleLogin} title="Login" />
        <ActivityIndicator
          color={'blue'}
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          size={'large'}
          animating={isLoading}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
