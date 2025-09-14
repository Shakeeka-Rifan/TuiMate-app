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
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/StudentSignupStyles';

export default function StudentSignupScreen({ navigation, route }) {
  const role = route?.params?.role || 'Student';

  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // ----------- Keep EXACT same signup logic -----------
  const handleSignup = async () => {
    // Input Validations
    if (!email || !name || !grade || !password || !confirmPassword) {
      return Alert.alert('Error', 'All fields are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email address.');
    }

    if (password.length < 6) {
      return Alert.alert('Weak Password', 'Password must be at least 6 characters.');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Password Mismatch', 'Passwords do not match.');
    }

    try {
      const response = await fetch('http://172.20.10.3:5000/api/auth/students/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, email, grade, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Student account created successfully.');
        navigation.navigate('StudentLogin');
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Could not connect to server.');
    }
  };
  // ----------------------------------------------------

  const InputRow = ({ icon, children }) => (
    <View style={styles.inputRow}>
      <Ionicons name={icon} size={20} style={styles.inputIcon} />
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
  contentContainerStyle={styles.scroll}

  keyboardDismissMode="none"
  removeClippedSubviews={false}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="always" // (duplicate ok if you paste over)
>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('RoleSelection')}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>Find tutions and start learning faster</Text>
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
              <Text style={styles.roleText}>{role}</Text>
            </View>

            {/* Name */}
           <View style={styles.inputRow}>
  <Ionicons name="person-outline" size={20} style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#8C99A5"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
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
              />
            </View>

            {/* Grade */}
            <View style={styles.inputRow}>
          <Ionicons name="ribbon-outline" size={20} style={styles.inputIcon} />
              <TextInput
                placeholder="Grade (6-11)"
                placeholderTextColor="#8C99A5"
                style={styles.input}
                value={grade}
                onChangeText={setGrade}
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
              />
              <TouchableOpacity
                onPress={() => setShowPass((s) => !s)}
                style={styles.eye}
                activeOpacity={0.7}
              >
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#5C6B76" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={20} style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#8C99A5"
                style={styles.input}
                secureTextEntry={!showConfirmPass}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPass((s) => !s)}
                style={styles.eye}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#5C6B76"
                />
              </TouchableOpacity>
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.9}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            {/* Footer hint */}
            <Text style={styles.tinyNote}>
              By signing up, you agree to Terms of Service & Privacy.
            </Text>
          </View>

          {/* Already have account */}
          <TouchableOpacity onPress={() => navigation.navigate('StudentLogin')} activeOpacity={0.7}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
