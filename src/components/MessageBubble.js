import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ text, isSender }) {
  return (
    <View style={[styles.bubble, isSender ? styles.right : styles.left]}>
      <Text style={{ color: '#fff' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  left: {
    alignSelf: 'flex-start',
    backgroundColor: '#999',
  },
  right: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e90ff',
  },
});
