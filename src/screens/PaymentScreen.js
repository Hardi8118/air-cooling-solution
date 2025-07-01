// src/screens/PaymentScreen.js
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function PaymentScreen({ route, navigation }) {
  const { order } = route.params;
  const service = order.service;

  const handlePayment = async () => {
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'paid',
      });
      Alert.alert('Pembayaran Berhasil');
      navigation.navigate('TrackTechnician', {
        technicianId: order.technicianId,
      });
    } catch (error) {
      Alert.alert('Gagal', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ringkasan Pembayaran</Text>
      <Text style={{ marginTop: 15 }}>Layanan: {service.title}</Text>
      <Text>Harga: Rp {service.price}</Text>
      <Text>Status Order: {order.status}</Text>

      <Button
        title="Bayar Sekarang"
        onPress={handlePayment}
        color="#1e90ff"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
