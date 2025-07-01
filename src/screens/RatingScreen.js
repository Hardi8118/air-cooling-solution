// src/screens/RatingScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth, db } from '../services/firebase';
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

export default function RatingScreen({ route, navigation }) {
  const { order } = route.params;
  const userId = auth.currentUser.uid;
  const technicianId = order.technicianId;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitRating = async () => {
    try {
      await addDoc(collection(db, 'ratings'), {
        userId,
        technicianId,
        orderId: order.id,
        value: rating,
        comment,
        createdAt: Timestamp.now()
      });

      // Update rata-rata rating teknisi
      const techRef = doc(db, 'users', technicianId);
      const techSnap = await getDoc(techRef);
      const techData = techSnap.data();

      const prevRating = techData.rating || 0;
      const totalJobs = techData.totalJobs || 0;

      const newTotalJobs = totalJobs + 1;
      const newRating = ((prevRating * totalJobs) + rating) / newTotalJobs;

      await updateDoc(techRef, {
        rating: newRating,
        totalJobs: newTotalJobs
      });

      Alert.alert('Terima kasih!', 'Rating berhasil dikirim');
      navigation.navigate('HomeUser');
    } catch (err) {
      Alert.alert('Gagal kirim rating', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Beri Penilaian untuk Teknisi</Text>
      <Text style={{ marginTop: 10 }}>Rating (1 - 5):</Text>
      <TextInput
        keyboardType="numeric"
        maxLength={1}
        value={rating.toString()}
        onChangeText={(text) => setRating(Number(text))}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginVertical: 10,
        }}
      />
      <Text>Komentar/Ulasan:</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Tulis komentar..."
        multiline
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          height: 100,
          marginVertical: 10
        }}
      />
      <Button title="Kirim Rating" onPress={submitRating} color="#1e90ff" />
    </View>
  );
}
