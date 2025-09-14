import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function StudentSettingsScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);

  const reloadProfile = () => {
    fetch(`http://172.20.10.3:5000/api/auth/students/${studentId}`)
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useFocusEffect(
    React.useCallback(() => {
      reloadProfile();
    }, [studentId])
  );

  const handleLogout = () => {
    navigation.replace('GetStarted');
  };

  return (
    <View style={styles.container}>
   <Image
  source={
    student?.profileImage
      ? { uri: student.profileImage.includes('http')
          ? student.profileImage
          : `http://172.20.10.3:5000/${student.profileImage.replace(/\\/g, '/')}`
        }
      : require('../assets/images/avatar.png')
  }
  style={styles.avatar}
/>

      <Text style={styles.name}>{student?.name || 'Student'}</Text>
      <Text style={styles.role}>TuiMate App</Text>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            navigation.navigate('StudentEditProfile', {
              studentId,
              onGoBack: reloadProfile, // 👈 trigger reload after returning
            })
          }
        >
          <Ionicons name="person-circle-outline" size={24} color="#088F9E" />
          <Text style={styles.optionText}>My Profile</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('ChangePassword', { studentId })}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#088F9E" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#088F9E" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF7F8',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#088F9E',
    fontFamily: 'Nunito_700Bold',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    fontFamily: 'Nunito_400Regular',
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    gap: 10,
  },
  option: {
    backgroundColor: '#b4f0ecff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 14,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#088F9E',
  },
});
