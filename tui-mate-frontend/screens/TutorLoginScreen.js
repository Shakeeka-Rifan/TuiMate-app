import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TutorLoginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TutorLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return alert('Enter email and password');

    try {
      const response = await fetch('http://172.20.10.3:5000/api/auth/tutors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        if (!data.tutor?.isApproved) {
          return Alert.alert('Not Approved', 'Your account is not yet approved by admin.');
        }
        await AsyncStorage.setItem('tutorId', data.tutor._id);
        navigation.navigate('TutorDashboard');
      } else {
        Alert.alert('Login failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Image source={require('../assets/images/student-signup.png')} style={styles.image} />
      <Text style={styles.heading}>Tutor Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      
      <TouchableOpacity onPress={() => navigation.navigate('TutorForgotPassword')}>
  <Text style={{ color: '#007BFF', marginTop: 10, textAlign: 'center', top:-10 }}>
    Forgot Password?
  </Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>



      <TouchableOpacity onPress={() => navigation.navigate('TutorSignup')}>
        <Text style={styles.signupText}>Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}
