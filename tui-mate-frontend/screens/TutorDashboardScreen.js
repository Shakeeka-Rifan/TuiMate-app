import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import FloatingChatButton from '../components/FloatingChatButton';
import { Animated, PanResponder } from 'react-native';
import io from 'socket.io-client';
const socket = io('http://172.20.10.3:5000');

import AsyncStorage from '@react-native-async-storage/async-storage';
import Draggable from 'react-native-draggable';

export default function TutorDashboardScreen({ navigation }) {
  const [tutorId, setTutorId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // NEW: upcoming classes state
  const [upcoming, setUpcoming] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);
  const [tutorName, setTutorName] = useState('');


  const isFocused = useIsFocused();

  const pan = useRef(new Animated.ValueXY({ x: 300, y: 500 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {},
    })
  ).current;

  // helper: combine class date + time to a Date object
  const toDateTime = (cls) => {
    try {
      const dateStr = cls?.date || '';
      const timeStr = (cls?.startTime || '00:00').padStart(5, '0');
      return new Date(`${dateStr}T${timeStr}`);
    } catch (e) {
      return new Date(0);
    }
  };
  

  // helper: DD-MM-YYYY
  const fmtDate = (iso) => {
    try {
      const [y, m, d] = iso.split('-').map(Number);
      return `${String(d).padStart(2, '0')}-${String(m).padStart(2, '0')}-${y}`;
    } catch {
      return iso;
    }
  };

  const fetchUpcoming = async (id) => {
    if (!id) return;
    setLoadingUpcoming(true);
    try {
      const res = await fetch(`http://172.20.10.3:5000/api/classes/tutor/${id}`);
      const data = await res.json();

      const now = new Date();
      const filtered = (Array.isArray(data) ? data : [])
        .filter((c) => {
          const when = toDateTime(c);
          const status = (c?.status || 'Pending').toLowerCase();
          return when >= now && status !== 'cancelled' && status !== 'completed';
        })
        .sort((a, b) => toDateTime(a) - toDateTime(b));

      setUpcoming(filtered);
    } catch (err) {
      console.error('Failed to fetch upcoming classes:', err);
    } finally {
      setLoadingUpcoming(false);
    }
  };

  

  useEffect(() => {
    const fetchData = async () => {
      const id = await AsyncStorage.getItem('tutorId');
      if (id) {
        setTutorId(id);
        try {
          const res = await fetch(`http://172.20.10.3:5000/api/tutor/${id}`);
          const data = await res.json();
          if (!data.message) setProfileImage(data.profileImage);
            setTutorName(data.name || '');   // 👈 add this

        } catch (err) {
          console.error('Failed to fetch tutor:', err);
        }
        // NEW: load upcoming list
        fetchUpcoming(id);
      }
    };
    if (isFocused) fetchData();
  }, [isFocused]);

  useEffect(() => {
    if (!tutorId) return;
    const handleMessage = (msg) => {
      if (msg.receiverId === tutorId) {
        setNotifications((prev) => [...prev, msg]);
      }
    };
    socket.on('receiveMessage', handleMessage);
    return () => socket.off('receiveMessage', handleMessage);
  }, [tutorId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            profileImage
              ? { uri: `http://172.20.10.3:5000/${profileImage}?${Date.now()}` }
              : require('../assets/images/avatar.png')
          }
          style={styles.avatar}
        />
        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen', { notifications })}>
            <Ionicons name="notifications" size={26} color="#3CAEFF" />
            {notifications.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('TutorChatList', { tutorId })}>
        <Text style={styles.chatButtonText}></Text>
      </TouchableOpacity>

    

      <View style={styles.welcomeCard}>
      <Text style={styles.greeting}>
  Hi, {tutorName ? tutorName.split(' ')[0] : 'Tutor'}
</Text>

        <Text style={styles.question}>Ready to teach Today?</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TutorClassCreation')}>
          <Text style={styles.buttonText}>Create new class</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StudentRequest', { tutorId })}>
          <Text style={styles.buttonText}>View Requests</Text>
        </TouchableOpacity>
       <TouchableOpacity
    style={[styles.button, { backgroundColor: '#088F9E', flexDirection:'row', alignItems:'center', justifyContent:'center' }]}
    onPress={() => navigation.navigate('TutorReviews', { tutorId })}
  >
   
    <Text style={styles.buttonText}>View Reviews</Text>
  </TouchableOpacity>

      </View>

      {/* ===== Upcoming Classes section ===== */}
      <View style={styles.upcomingSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TutorTimeTable', { tutorId })}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {loadingUpcoming ? (
          <ActivityIndicator size="small" color="#088F9E" style={{ marginTop: 10 }} />
        ) : upcoming.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming classes.</Text>
        ) : (
          upcoming.slice(0, 3).map((cls) => (
            <TouchableOpacity
              key={cls._id}
              style={styles.upcomingCard}
              onPress={() =>
                navigation.navigate('ClassDetails', {
                  classId: cls._id,
                  subject: cls.subject,
                  grade: cls.grade,
                  batchSize: cls.batchSize,
                  date: cls.date,
                  startTime: cls.startTime,
                  fee: cls.fee,
                  tutorId: tutorId,
                })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.upcomingSubject}>{cls.subject || 'Class'}</Text>
                <Text style={styles.upcomingMeta}>
                  {fmtDate(cls.date)} • {cls.startTime}
                </Text>
                {cls.grade ? <Text style={styles.upcomingMeta}>Grade: {cls.grade}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={22} color="#088F9E" />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.fixedReview}>
  <TouchableOpacity
    style={styles.reviewFab}
    onPress={() => navigation.navigate('TutorReviewsScreen', { tutorId })}
    activeOpacity={0.8}
  >
    <Ionicons name="star" size={28} color="white" />
  </TouchableOpacity>
</View>


      {/* Fixed chat button (bottom-left) */}
<View style={styles.fixedChat}>
  <TouchableOpacity
    onPress={() => navigation.navigate('TutorChatList', { tutorId })}
    style={styles.chatFab}
    activeOpacity={0.8}
  >
    <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
  </TouchableOpacity>
</View>

      {/* ===== /Upcoming Classes section ===== */}

      <View style={styles.navbar}>
        <TouchableOpacity>
          <Ionicons name="home" size={26} color="white" left={6} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('TutorTimeTable', { tutorId })}>
          <Ionicons name="calendar" size={26} color="white" left={15} />
          <Text style={styles.navText}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('TutorProgress')}>
          <Ionicons name="stats-chart" size={26} color="white" left={10} />
          <Text style={styles.navText}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            let id = tutorId;
            if (!id) {
              id = await AsyncStorage.getItem('tutorId');
            }
            if (!id) {
              Alert.alert('Error', 'Tutor ID not found');
              return;
            }
            navigation.navigate('TutorSettings', { tutorId: id });
          }}
        >
          <Ionicons name="person" size={26} color="white" left={7} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDF7F8', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Nunito_700Bold' },
  avatar: { width: 40, height: 40, borderRadius: 20, top: 10, fontFamily: 'Nunito_700Bold' },

  welcomeCard: {
    backgroundColor: '#088F9E',
    borderRadius: 20,
    padding: 20,
    marginVertical: 25,
    alignItems: 'center',
    fontFamily: 'Nunito_700Bold'
  },
  greeting: { fontSize: 20, color: 'white', fontWeight: 'bold', fontFamily: 'Nunito_700Bold' },
  question: { fontSize: 16, color: 'white', marginVertical: 10, fontFamily: 'Nunito_400Regular' },
  searchButton: { backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 30 },
  searchButtonText: { color: '#088F9E', fontWeight: 'bold', fontFamily: 'Nunito_700Bold' },

  quickButtons: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  button: { backgroundColor: '#088F9E', padding: 12, borderRadius: 12, flex: 1, marginHorizontal: 5 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '600', fontFamily: 'Nunito_700Bold' },

  fixedChat: {
  position: 'absolute',
  right: 20,
  bottom: 90,   // sits above your bottom navbar (which is bottom: 10)
  zIndex: 99,
  fontFamily: 'Nunito_700Bold'
},
chatFab: {
  backgroundColor: '#088F9E',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  // shadows
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,      // Android shadow
},


  // NEW: Upcoming section styles
  upcomingSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    marginBottom: 90, // keep space above bottom navbar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontFamily: 'Nunito_700Bold' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0B3E45', fontFamily: 'Poppins_700Bold' },
  viewAll: { fontSize: 12, color: '#088F9E', fontWeight: '600', textDecorationLine: 'underline' },
  emptyText: { fontSize: 13, color: '#6B7280', marginTop: 6, fontFamily: 'Poppins_400Regular' },

  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  upcomingSubject: { fontSize: 15, fontWeight: '600', color: '#0A0F12', fontFamily: 'Nunito_700Bold'},
  upcomingMeta: { fontSize: 12, color: '#4B5563', marginTop: 2, fontFamily: 'Nunito_400Regular' },

  

  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#088F9E',
    paddingVertical: 14,
    borderRadius: 20,
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignSelf: 'center',
  },
  navText: { fontSize: 12, color: 'white', textAlign: 'center', marginTop: 2, fontFamily: 'Nunito_400Regular', left: 1 },

  chatButton: {},
  chatButtonText: {},
});
