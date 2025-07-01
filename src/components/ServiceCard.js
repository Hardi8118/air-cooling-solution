// src/components/ServiceCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function ServiceCard({ service, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(service)}>
      <Image source={{ uri: service.icon }} style={styles.icon} />
      <View style={styles.info}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.desc}>{service.description}</Text>
        <Text style={styles.price}>Rp {service.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  desc: {
    color: '#666',
  },
  price: {
    marginTop: 6,
    fontWeight: '600',
    color: '#1e90ff',
  },
});
