// src/screens/ChatScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import io from 'socket.io-client';
import styles from '../styles/ChatScreenStyles';

const socket = io('http://172.20.10.3:5000');

export default function ChatScreen({ route, navigation }) {
  const { studentId, tutorId, userRole } = route.params;
  const senderId = userRole === 'Student' ? studentId : tutorId;
  const receiverId = userRole === 'Student' ? tutorId : studentId;

  const [chatPartnerName, setChatPartnerName] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
  // Fetch chat messages
  fetch(`http://172.20.10.3:5000/api/chat/${senderId}/${receiverId}`)
    .then((res) => res.json())
    .then(setMessages)
    .catch((err) => console.error('Error loading messages:', err));

  // Fetch chat partner name
  const fetchChatPartner = async () => {
    try {
      const res = await fetch(
        userRole === 'Student'
          ? `http://172.20.10.3:5000/api/tutor/${receiverId}`
          : `http://172.20.10.3:5000/api/student/${receiverId}`
      );
      const data = await res.json();
      setChatPartnerName(data.name || 'Chat');
    } catch (err) {
      console.error('Failed to load chat partner name:', err);
    }
  };

  fetchChatPartner();

  // Set up socket listener
  const handleReceiveMessage = (msg) => {
  setMessages((prev) => {
    // Check if message already exists by _id
    if (prev.some((m) => m._id === msg._id)) {
      return prev; // Skip duplicate
    }
    return [...prev, msg];
  });
};


  socket.on('receiveMessage', handleReceiveMessage);

  // ✅ Clean up
  return () => {
    socket.off('receiveMessage', handleReceiveMessage); // 💡 Fixes duplication
    socket.disconnect();
  };
}, []);

const sendMessage = async () => {
  if (text.trim()) {
    const messageObj = {
      senderId,
      receiverId,
      message: text,
    };

    socket.emit('sendMessage', messageObj); // Socket handles saving
    setText('');
  }
};



  return (
     <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.select({ ios: 'padding', android: undefined })}
  >
     <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.nameText}>{chatPartnerName}</Text>
            <Text style={styles.lastSeenText}>Last seen 11:43 AM</Text>
          </View>

         
        </View>

        {/* Chat list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            const isMine = item.senderId === senderId;
            const time = new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View
                style={[
                  styles.messageContainer,
                  isMine ? styles.myContainer : styles.theirContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMine ? styles.myMessage : styles.theirMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{item.message}</Text>
                  <Text style={styles.messageTime}>{time}</Text>
                </View>
              </View>
            );
          }}

           contentContainerStyle={{ paddingBottom: 80 }} // give room for input
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
      />
        
        

        {/* Message input */}
         <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type something..."
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
