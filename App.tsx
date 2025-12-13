// import React, { useState } from 'react';
// import { Text, Button, View } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// import { TokenService } from './src/services/storage/keychain.services';

// export default function App() {
//   const [token, setToken] = useState<string | null>(null);

//   // Save token
//   const handleSaveToken = async () => {
//     await TokenService.save("MY_SECURE_TOKEN_123");
//   };

//   // Get token
//   const handleGetToken = async () => {
//     const value = await TokenService.get();
//     setToken(value);
//   };

//   // Remove token
//   const handleRemoveToken = async () => {
//     await TokenService.remove();
//     setToken(null);
//   };

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView
//         edges={['top', 'left', 'right']}
//         style={{ flex: 1, paddingHorizontal: 16 }}
//       >
//         <View style={{ marginVertical: 10 }}>
//           <Button title="Save Token" onPress={handleSaveToken} />
//         </View>

//         <View style={{ marginVertical: 10 }}>
//           <Button title="Get Token" onPress={handleGetToken} />
//         </View>

//         <View style={{ marginVertical: 10 }}>
//           <Button title="Remove Token" onPress={handleRemoveToken} />
//         </View>

//         <Text style={{ marginTop: 20, fontSize: 18 }}>
//           Token: {token ?? "null"}
//         </Text>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

import React from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import RootNavigator from './src/navigation/stacks/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
}
