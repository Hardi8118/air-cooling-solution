// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' atau 'technician'

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        role
      });

      Alert.alert("Berhasil", "Akun berhasil dibuat");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Gagal", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Text>Daftar Sebagai:</Text>
      <Button title="Pengguna" onPress={() => setRole('user')} />
      <Button title="Teknisi" onPress={() => setRole('technician')} />
      <Button title="Daftar" onPress={handleRegister} />
      <Text onPress={() => navigation.navigate('Login')}>Sudah punya akun? Masuk</Text>
    </View>
  );
}
