// src/screens/HomeTechnicianScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../services/firebase';
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';

export default function HomeTechnicianScreen() {
  const [orders, setOrders] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const technicianId = auth.currentUser.uid;

  const fetchServices = async () => {
    const snapshot = await onSnapshot(collection(db, 'services'));
    const serviceObj = {};
    snapshot.forEach((doc) => {
      serviceObj[doc.id] = doc.data();
    });
    setServicesMap(serviceObj);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      await fetchServices();
      const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
      const snapshot = await onSnapshot(q);
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      Alert.alert('Gagal memuat order', err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        technicianId,
        status: 'accepted',
      });
      Alert.alert('Berhasil', 'Order telah diterima');
      fetchOrders();
    } catch (error) {
      Alert.alert('Gagal menerima order', error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => {
    const service = servicesMap[item.serviceId] || {};
    return (
      <View style={{ marginBottom: 15, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{service.title || 'Layanan'}</Text>
        <Text>Catatan: {item.notes}</Text>
        <Text>Jadwal: {item.scheduledTime?.toDate().toLocaleString()}</Text>
        <Button title="Terima Order" onPress={() => acceptOrder(item.id)} color="#28a745" />
      </View>
    );
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>Order Masuk</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : orders.length === 0 ? (
        <Text>Tidak ada order saat ini</Text>
      ) : (
        <FlatList data={orders} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}
    </View>
  );
}
