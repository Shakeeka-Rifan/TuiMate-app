import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import styles from '../styles/BookingDetailsStudentStyles';
import { Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';



export default function BookingDetailsStudentScreen({ route, navigation }) {
  const {
    bookingId,
    tutorName,
    tutorId,
    subject,
    date,
    startTime,
    fee,
    latitude,
    longitude,
    status,
    attendanceStatus,
    studentId
  } = route.params;

  
const [studentLocation, setStudentLocation] = useState(null);

  const handleMarkAttendance = async (newStatus) => {
    try {
      const res = await fetch(`http://172.20.10.3:5000/api/bookings/booking/${bookingId}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      Alert.alert(
  'Success',
  data.message,
  [
    { text: 'Later', style: 'cancel', onPress: () => navigation.navigate('BookingRequestsStudent', { studentId }) },
    {
      text: 'Write Review',
      onPress: () =>
        navigation.navigate('SubmitReview', {
          tutorId,
          tutorName,
          studentId,
          classId: bookingId
        }),
    },
  ],
  { cancelable: false }
);
} catch (err) {
      console.error('Attendance error:', err);
      Alert.alert('Error', 'Failed to update attendance');
    }
  };

  
const handleNavigateToLocation = (mode = 'driving') => {
  const origin = studentLocation
    ? `${studentLocation.latitude},${studentLocation.longitude}`
    : 'Current+Location'; // Google will use device location

  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${latitude},${longitude}&travelmode=${mode}`;
  Linking.openURL(url).catch(() =>
    Alert.alert('Error', 'Google Maps could not be opened')
  );
};


useEffect(() => {
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setStudentLocation(location.coords);
  })();
}, []);






  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#5A83EC" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />

        <Text style={styles.tutorName}>Mr. {tutorName}</Text>
        <Text style={styles.subject}>{subject}</Text>

        <Text style={styles.infoRow}>📅 {date} {startTime}</Text>
        <Text style={styles.infoRow}>💵 Fee: Rs. {fee}/=</Text>

        <MapView
  style={styles.map}
  initialRegion={{
    latitude: latitude || 7.8731,
    longitude: longitude || 80.7718,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  {/* Tutor Marker */}
  <Marker
    coordinate={{ latitude: latitude || 7.8731, longitude: longitude || 80.7718 }}
    title="Tutor"
    pinColor="red"
  />

  {/* Student Marker */}
  {studentLocation && (
    <Marker
      coordinate={{
        latitude: studentLocation.latitude,
        longitude: studentLocation.longitude,
      }}
      title="You"
      pinColor="blue"
    />
  )}
</MapView>


        

<View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
  <TouchableOpacity style={styles.ctionButton} onPress={() => handleNavigateToLocation('driving')}>
    <Ionicons name="car-outline" size={24} color="white" />
  </TouchableOpacity>

  <TouchableOpacity style={styles.ctionButton} onPress={() => handleNavigateToLocation('walking')}>
    <Ionicons name="walk-outline" size={24} color="white" />
  </TouchableOpacity>

  <TouchableOpacity style={styles.ctionButton} onPress={() => handleNavigateToLocation('transit')}>
    <Ionicons name="bus-outline" size={24} color="white" />
  </TouchableOpacity>
</View>



        {status === 'Accepted' && attendanceStatus === 'Upcoming' && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleMarkAttendance('Completed')}
            >
              <Text style={styles.actionButtonText}>Mark as completed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ccc' }]}
              onPress={() => handleMarkAttendance('NotAttended')}
            >
              <Text style={[styles.actionButtonText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
