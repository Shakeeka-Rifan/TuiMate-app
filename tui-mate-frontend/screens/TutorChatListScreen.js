import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TutorChatStyles';

const BASE_URL = 'http://172.20.10.3:5000';

// Normalize image paths coming from backend
const resolveImage = (p) => {
  if (!p) return null;
  const clean = String(p).replace(/\\/g, '/');
  return clean.startsWith('http') ? clean : `${BASE_URL}/${clean}`;
};

export default function TutorChatListScreen({ navigation }) {
  const [tutorId, setTutorId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem('tutorId');
      setTutorId(id);
      if (!id) return;

      const res  = await fetch(`${BASE_URL}/api/chat/tutor/${id}/students`);
      const data = await res.json();

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load student chat list:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const renderItem = ({ item }) => {
    const uri = resolveImage(item.profileImage);
    const preview = item.lastMessage || 'No messages yet.';
    const formattedTime = item.lastMessageTime
      ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            studentId: item._id,
            tutorId,
            userRole: 'Tutor',
          })
        }
        activeOpacity={0.85}
      >
        <Image
          source={uri ? { uri } : require('../assets/images/avatar.png')}
          style={styles.avatar}
        />

        <View style={styles.chatTextContainer}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.messagePreview} numberOfLines={1}>
            {preview}
          </Text>
        </View>

        {!!formattedTime && <Text style={styles.timeText}>{formattedTime}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats with Students</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#088F9E" style={{ marginTop: 30 }} />
      ) : students.length === 0 ? (
        <Text style={styles.empty}>No chat history found</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => String(item._id)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}
