import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      console.log('Koneksi:', state.isConnected ? 'Online' : 'Offline');
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <>
      {!isConnected && (
        <View style={{ backgroundColor: 'orange', padding: 10 }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>⚠️ Tidak terhubung internet</Text>
        </View>
      )}
      <AppNavigator />
    </>
  );
}
