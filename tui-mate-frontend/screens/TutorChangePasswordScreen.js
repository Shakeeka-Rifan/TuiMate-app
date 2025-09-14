import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/TutorChangePasswordStyles';

const BASE_URL = 'http://172.20.10.3:5000';

export default function TutorChangePasswordScreen({ route, navigation }) {
  const [tutorId, setTutorId] = useState(route?.params?.tutorId || null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!tutorId) {
        const id = await AsyncStorage.getItem('tutorId');
        if (id) setTutorId(id);
      }
    })();
  }, []);

  const strength = (() => {
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) s++;
    if (/\d/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s; // 0..4
  })();

  const passwordValid =
    newPassword.length >= 8 &&
    /[A-Za-z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    newPassword === confirmPassword &&
    newPassword !== currentPassword;

  const handleSubmit = async () => {
    if (!tutorId) return Alert.alert('Error', 'Tutor ID not found');
    if (!currentPassword || !newPassword || !confirmPassword)
      return Alert.alert('Missing', 'Please fill all fields.');
    if (!passwordValid)
      return Alert.alert('Invalid', 'Check password rules and confirmation.');

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/api/tutor/${tutorId}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return Alert.alert('Error', data?.message || 'Failed to change password');
      }
      Alert.alert('Success', 'Password updated successfully.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Network error', 'Could not contact server.');
    } finally {
      setSubmitting(false);
    }
  };

  const strengthLabel = ['Too weak', 'Weak', 'Okay', 'Strong', 'Very strong'][strength];
  const strengthWidth = ['20%', '40%', '60%', '80%', '100%'][strength];
  const strengthColor = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'][strength];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Ionicons name="arrow-back" size={20} color="#0B3E45" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>

          {/* Current */}
          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed-outline" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Current password"
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent((s) => !s)}>
              <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* New */}
          <View style={styles.inputGroup}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="New password (min 8 chars)"
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew((s) => !s)}>
              <Ionicons name={showNew ? 'eye-off' : 'eye'} size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Strength */}
          <View style={styles.strengthRow}>
            <View style={styles.strengthBar}>
              <View style={[styles.strengthFill, { width: strengthWidth, backgroundColor: strengthColor }]} />
            </View>
            <Text style={styles.strengthText}>{strengthLabel}</Text>
          </View>

          {/* Confirm */}
          <View style={styles.inputGroup}>
            <Ionicons name="checkmark-done-outline" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm((s) => !s)}>
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={styles.tipsWrap}>
            <Ionicons name="information-circle-outline" size={16} color="#0B3E45" />
            <Text style={styles.tipText}>Use 8+ chars with letters & numbers. Avoid reusing old passwords.</Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, (!passwordValid || submitting) && { opacity: 0.6 }]}
            disabled={!passwordValid || submitting}
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <Ionicons name="key-outline" size={18} color="#fff" />
            <Text style={styles.submitText}>{submitting ? 'Updating…' : 'Update Password'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
