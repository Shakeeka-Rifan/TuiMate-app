import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import styles from '../styles/TutorVerifyOTPStyles';

export default function TutorVerifyOTPScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.length !== 4) return Alert.alert('Invalid OTP');
    navigation.navigate('TutorResetPassword', { email, otp });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/verify.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Verify Tutor Email</Text>
      <Text style={styles.subtitle}>Enter 4-digit OTP sent to {email}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}