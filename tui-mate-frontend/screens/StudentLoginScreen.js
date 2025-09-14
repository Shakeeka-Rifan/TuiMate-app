import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/StudentLoginStyles';

export default function StudentLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // --------- SAME API + LOGIC (unchanged) ----------
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Email and Password are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Invalid Email', 'Enter a valid email.');
    }

    try {
      const response = await fetch(
        'http://172.20.10.3:5000/api/auth/students/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('studentId', data.student._id);
        await AsyncStorage.setItem('studentToken', data.token);
        Alert.alert('Login Success', 'Welcome!');

        // ✅ Check if quiz completed (unchanged)
        if (!data.student.quizCompleted) {
          navigation.navigate('StudentQuiz', { studentId: data.student._id });
        } else {
          navigation.navigate('StudentDashboard', { studentId: data.student._id });
        }
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Could not connect to server.');
    }
  };
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('RoleSelection')}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Log in to find near tutions</Text>
            </View>
          </View>

          {/* Illustration */}
          <Image
            source={require('../assets/images/student-signup.png')}
            style={styles.hero}
          />

          {/* Form Card */}
          <View style={styles.card}>
            {/* Role (read-only) */}
            <View style={styles.rolePill}>
              <Ionicons name="school" size={16} color="#0A8F9E" />
              <Text style={styles.roleText}>Student</Text>
            </View>

            {/* Email */}
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={20} style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#8C99A5"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={20} style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#8C99A5"
                style={styles.input}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={() => setShowPass((s) => !s)}
                style={styles.eye}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#5C6B76"
                />
              </TouchableOpacity>
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.9}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Links */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Signup link */}
          <TouchableOpacity onPress={() => navigation.navigate('StudentSignup')} activeOpacity={0.7}>
            <Text style={styles.signupText}>
              Don’t have an account? <Text style={styles.signupLink}>Signup</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
