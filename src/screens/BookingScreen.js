// src/screens/BookingScreen.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { v4 as uuidv4 } from 'uuid';

export default function BookingScreen({ route, navigation }) {
  const { service } = route.params;
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleBooking = async () => {
    const userId = auth.currentUser.uid;
    const orderId = uuidv4();

    try {
      await setDoc(doc(db, 'orders', orderId), {
        orderId,
        userId,
        technicianId: '', // nanti diisi otomatis/oleh admin/manual
        serviceId: service.id,
        status: 'pending',
        scheduledTime: Timestamp.fromDate(selectedDate),
        location: null, // nanti bisa tambah lokasi (geoPoint)
        createdAt: Timestamp.now(),
        notes,
      });
      Alert.alert("Sukses", "Pemesanan berhasil dibuat");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Gagal", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{service.title}</Text>
      <Text style={{ color: '#666', marginBottom: 10 }}>{service.description}</Text>
      <Text style={{ fontWeight: 'bold' }}>Harga: Rp {service.price}</Text>

      <Text style={{ marginTop: 20 }}>Pilih Tanggal & Waktu Servis:</Text>
      <Button
        title={selectedDate.toLocaleString()}
        onPress={() => setShowPicker(true)}
      />

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <Text style={{ marginTop: 20 }}>Catatan Tambahan:</Text>
      <TextInput
        placeholder="Contoh: AC di lantai 2"
        value={notes}
        onChangeText={setNotes}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        }}
        multiline
      />

      <Button title="Pesan Sekarang" onPress={handleBooking} color="#1e90ff" />
    </View>
  );
}
