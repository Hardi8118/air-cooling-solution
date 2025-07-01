// src/screens/HistoryTechnicianScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function HistoryTechnicianScreen() {
  const [orders, setOrders] = useState([]);
  const techId = auth.currentUser.uid;

  const fetchHistory = async () => {
    const q = query(collection(db, 'orders'), where('technicianId', '==', techId));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(result);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: '#f9f9f9', padding: 15, marginBottom: 10, borderRadius: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.serviceId}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Jadwal: {item.scheduledTime?.toDate().toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Riwayat Pekerjaan Anda</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>Belum ada riwayat pekerjaan.</Text>}
      />
    </View>
  );
}
