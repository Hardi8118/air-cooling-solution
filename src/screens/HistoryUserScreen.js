// src/screens/HistoryUserScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function HistoryUserScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const userId = auth.currentUser.uid;

  const fetchHistory = async () => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(result);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: '#f0f0f0', padding: 15, marginBottom: 10, borderRadius: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.serviceId}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Jadwal: {item.scheduledTime?.toDate().toLocaleString()}</Text>
      <View style={{ flexDirection: 'row', marginTop: 10, gap: 5 }}>
        {item.status === 'accepted' && (
          <Button title="Lacak Teknisi" onPress={() => navigation.navigate('TrackTechnician', { technicianId: item.technicianId })} />
        )}
        <Button title="Chat" onPress={() => navigation.navigate('Chat', {
          userId: userId,
          technicianId: item.technicianId,
        })} />
        {item.status === 'done' && (
          <Button title="Rating" onPress={() => navigation.navigate('Rating', { order: item })} />
        )}
      </View>
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Riwayat Pemesanan Anda</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>Belum ada riwayat.</Text>}
      />
    </View>
  );
}
