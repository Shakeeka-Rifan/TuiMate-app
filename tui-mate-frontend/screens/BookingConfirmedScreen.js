import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/BookingConfirmedStyles';

export default function BookingConfirmedScreen({ navigation, route }) {
   const {studentId} = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#5A83EC" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Image source={require('../assets/images/Booking-confirmed.png')} style={styles.icon} />

        <Text style={styles.title}>Booking Confirmed</Text>
        <Text style={styles.subtitle}>
          Your class has been successfully booked, please wait until your tutor accepts your booking
        </Text>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('StudentDashboard',  { studentId })}>
          <Text style={styles.homeButtonText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
