import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/ConfirmBookingStyles';

export default function ConfirmBookingScreen({ route, navigation }) {
  const { tutorId, studentId, tutorName, subject, classId } = route.params;

  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClassDetails = async () => {
    try {
      const res = await fetch(`http://172.20.10.3:5000/api/classes/class/${classId}`);
      const data = await res.json();
      setClassDetails(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching class details:', err);
      Alert.alert('Error', 'Failed to fetch class details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, []);

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch('http://172.20.10.3:5000/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId,
          studentId,
          classId
        })
      });

      const data = await res.json();

      if (res.status === 201) {
        navigation.navigate('BookingConfirmed', { studentId });
      } else {
        Alert.alert('Error', data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      Alert.alert('Network error');
    }
  };

  if (loading || !classDetails) {
    return <ActivityIndicator size="large" color="#088F9E" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#5A83EC" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />

        <Text style={styles.tutorName}>Mr. {tutorName}</Text>
        <Text style={styles.subject}>{subject}</Text>

        <Text style={styles.infoRow}>📅 {classDetails.date} {classDetails.startTime}</Text>
        <Text style={styles.infoRow}>💵 Fee: Rs. {classDetails.fee}/=</Text>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
          <Text style={styles.confirmButtonText}>Confirm booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
