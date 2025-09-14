// ✅ screens/ChangePasswordScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, Platform,
  KeyboardAvoidingView, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/ChangePasswordStyles';

const BASE_URL = 'http://172.20.10.3:5000';

export default function ChangePasswordScreen({ route, navigation }) {
  const { studentId } = route.params;

  const [currentPassword, setCurrentPassword]   = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');

  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  // password strength (0..4)
  const strength = useMemo(() => {
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) s++;
    if (/\d/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s;
  }, [newPassword]);

  const strengthLabel  = ['Too weak', 'Weak', 'Okay', 'Strong', 'Very strong'][strength];
  const strengthWidth  = ['20%', '40%', '60%', '80%', '100%'][strength];
  const strengthColor  = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'][strength];

  // client-only validation (API unchanged)
  const passwordValid =
    newPassword.length >= 8 &&
    /[A-Za-z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    newPassword === confirmPassword &&
    newPassword !== currentPassword;

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert('Missing', 'Please fill all fields.');
    }
    if (!passwordValid) {
      return Alert.alert(
        'Invalid',
        'Password must be 8+ chars, include letters & numbers, match confirmation, and differ from current.'
      );
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/api/auth/students/change-password/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }), // ✅ API unchanged
      });
      const data = await res.json();
      if (!res.ok) {
        return Alert.alert('Error', data?.message || 'Change failed');
      }
      Alert.alert('Success', 'Password changed successfully.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#EDF7F8' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

          {/* Current password */}
          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed-outline" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              placeholder="Current password"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent(s => !s)}>
              <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* New password */}
          <View style={styles.inputGroup}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              placeholder="New password (min 8 chars)"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(s => !s)}>
              <Ionicons name={showNew ? 'eye-off' : 'eye'} size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Strength meter */}
          <View style={styles.strengthRow}>
            <View style={styles.strengthBar}>
              <View style={[styles.strengthFill, { width: strengthWidth, backgroundColor: strengthColor }]} />
            </View>
            <Text style={styles.strengthText}>{strengthLabel}</Text>
          </View>

          {/* Confirm password */}
          <View style={styles.inputGroup}>
            <Ionicons name="checkmark-done-outline" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(s => !s)}>
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={styles.tipsWrap}>
            <Ionicons name="information-circle-outline" size={16} color="#0B3E45" />
            <Text style={styles.tipText}>
              Use at least 8 characters with letters and numbers. Don’t reuse your current password.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, (!passwordValid || submitting) && { opacity: 0.6 }]}
            disabled={!passwordValid || submitting}
            onPress={handleChangePassword}
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
