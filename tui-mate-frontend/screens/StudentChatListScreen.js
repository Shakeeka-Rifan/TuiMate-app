// StudentChatListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/StudentChatStyles1';

export default function StudentChatListScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://172.20.10.3:5000/api/chat/student/${studentId}/tutors`)
      .then(res => res.json())
      .then(data => {
        setTutors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching chat tutors:', err);
        setLoading(false);
      });
  }, [studentId]);

  const renderItem = ({ item }) => {
    const formattedTime = item.lastMessageTime
      ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            studentId,
            tutorId: item._id,
            userRole: 'Student',
          })
        }
      >
        <Image
          source={
            item.profileImage
              ? { uri: `http://172.20.10.3:5000/${item.profileImage}` }
              : require('../assets/images/avatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.chatTextContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.messagePreview} numberOfLines={1}>{item.lastMessage || 'No messages yet.'}</Text>
          
        </View>
        <Text style={styles.timeText}>{formattedTime}</Text>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats with Tutors</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#088F9E" style={{ marginTop: 30 }} />
      ) : tutors.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40 }}>No chat history found</Text>
      ) : (
        <FlatList
          data={tutors}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
