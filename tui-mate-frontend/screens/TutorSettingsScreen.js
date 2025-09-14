import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://172.20.10.3:5000';
const resolveImage = (imgPath) => {
  if (!imgPath) return null;
  const clean = String(imgPath).replace(/\\/g, '/');
  return clean.startsWith('http') ? clean : `${BASE_URL}/${clean}`;
};

export default function TutorSettingsScreen({ route, navigation }) {
  const paramId = route?.params?.tutorId;
  const [tutorId, setTutorId] = useState(paramId || null);
  const [tutor, setTutor] = useState(null);

  const ensureId = async () => {
    if (tutorId) return tutorId;
    const stored = await AsyncStorage.getItem('tutorId');
    if (stored) setTutorId(stored);
    return stored;
  };

  const reloadProfile = async () => {
    const id = await ensureId();
    if (!id) return;
    fetch(`${BASE_URL}/api/tutor/${id}`)
      .then((res) => res.json())
      .then((data) => setTutor(data))
      .catch((err) => console.error('Tutor fetch error:', err));
  };

  useFocusEffect(
    React.useCallback(() => {
      reloadProfile();
    }, [tutorId])
  );

  const handleLogout = async () => {
    try { await AsyncStorage.removeItem('tutorId'); } catch {}
    navigation.replace('GetStarted');
  };

  const avatarUri = resolveImage(tutor?.profileImage);

  return (
    <View style={styles.container}>
      <Image
        source={avatarUri ? { uri: `${avatarUri}?t=${Date.now()}` } : require('../assets/images/avatar.png')}
        style={styles.avatar}
      />
      <Text style={styles.name}>{tutor?.name || 'Tutor'}</Text>
      <Text style={styles.role}>TuiMate App</Text>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            navigation.navigate('TutorProfile', {
              tutorId: tutorId || paramId,
              onGoBack: reloadProfile, // refresh after edits
            })
          }
          activeOpacity={0.85}
        >
          <Ionicons name="person-circle-outline" size={24} color="#088F9E" />
          <Text style={styles.optionText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('TutorChangePassword', { tutorId: tutorId || paramId, role: 'Tutor' })}
          activeOpacity={0.85}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#088F9E" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={24} color="#088F9E" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDF7F8', alignItems: 'center', paddingTop: 60 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#088F9E', fontFamily: 'Nunito_700Bold' },
  role: { fontSize: 14, color: '#666', marginBottom: 30, fontFamily: 'Nunito_400Regular' },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  option: {
    backgroundColor: '#b4f0ecff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 14,
  },
  optionText: { marginLeft: 12, fontSize: 14, fontFamily: 'Nunito_700Bold', color: '#088F9E' },
});
