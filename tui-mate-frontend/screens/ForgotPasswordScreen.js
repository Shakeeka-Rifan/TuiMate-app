import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import styles from '../styles/ForgotPasswordStyles';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendOTP = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email.');

    try {
      const response = await fetch('http://172.20.10.3:5000/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'OTP sent to your email.');
        navigation.navigate('VerifyOTP', { email });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Network issue.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔽 VECTOR IMAGE */}
      <Image
        source={require('../assets/images/forgot.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Please Enter Your Email Address To Receive a Verification Code</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
