import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function TrackTechnicianScreen({ route }) {
  const { technicianId } = route.params;
  const [location, setLocation] = useState(null);

  const fetchTechnicianLocation = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', technicianId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.location) {
          setLocation(data.location);
        } else {
          Alert.alert('Lokasi tidak tersedia untuk teknisi ini.');
        }
      }
    } catch (error) {
      Alert.alert('Gagal memuat lokasi', error.message);
    }
  };

  useEffect(() => {
    fetchTechnicianLocation();
  }, []);

  if (!location) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title="Teknisi Anda"
        description="Lokasi terkini teknisi"
      />
    </MapView>
  );
}
