import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { db, auth } from '../services/firebase';
import { doc, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import MessageBubble from '../components/MessageBubble';

export default function ChatScreen({ route }) {
  const { userId, technicianId } = route.params; // diterima dari Home
  const currentUserId = auth.currentUser.uid;
  const chatId = userId < technicianId ? `${userId}_${technicianId}` : `${technicianId}_${userId}`;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'chats', chatId, 'messages'),
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => doc.data());
        setMessages(msgs.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));
      }
    );
    return unsub;
  }, []);

  const sendMessage = async () => {
    if (text.trim() === '') return;
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId: currentUserId,
      createdAt: serverTimestamp(),
    });
    setText('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble text={item.text} isSender={item.senderId === currentUserId} />
        )}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 20 }}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            paddingHorizontal: 15,
          }}
          value={text}
          onChangeText={setText}
          placeholder="Ketik pesan..."
        />
        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}
