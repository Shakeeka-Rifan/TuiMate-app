import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/TutorProfileStyles';

const BASE_URL = 'http://172.20.10.3:5000';

// helpers
const resolveImage = (imgPath) => {
  if (!imgPath) return null;
  const clean = String(imgPath).replace(/\\/g, '/');
  return clean.startsWith('http') ? clean : `${BASE_URL}/${clean}`;
};

export default function TutorProfileScreen({ route, navigation }) {
  const paramId = route?.params?.tutorId;
  const onSaved = route?.params?.onSaved;
  const [tutorId, setTutorId] = useState(paramId || null);

  // form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');        // editable
  const [nic, setNIC] = useState('');
  const [qualification, setQualification] = useState('');
  const [subjectsText, setSubjectsText] = useState(''); // comma-separated UI (backend expects array)
  const [gender, setGender] = useState(null);
  const [availability, setAvailability] = useState([]); // multi
  const [grades, setGrades] = useState([]);             // multi
  const [fee, setFee] = useState('');
  const [location, setLocation] = useState('');

  // dropdown state
  const [genderOpen, setGenderOpen] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [gradesOpen, setGradesOpen] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const availabilityOptions = [
    { label: 'Morning', value: 'Morning' },
    { label: 'Afternoon', value: 'Afternoon' },
    { label: 'Evening', value: 'Evening' },
    { label: 'Night', value: 'Night' },
  ];

  const gradeOptions = Array.from({ length: 13 }, (_, i) => {
    const v = String(i + 1);
    return { label: `Grade ${v}`, value: v };
  });

  // ensure only one dropdown opens
  const onGenderOpen = useCallback(() => {
    setAvailOpen(false);
    setGradesOpen(false);
  }, []);
  const onAvailOpen = useCallback(() => {
    setGenderOpen(false);
    setGradesOpen(false);
  }, []);
  const onGradesOpen = useCallback(() => {
    setGenderOpen(false);
    setAvailOpen(false);
  }, []);

  const ensureId = async () => {
    if (tutorId) return tutorId;
    const stored = await AsyncStorage.getItem('tutorId');
    if (stored) setTutorId(stored);
    return stored;
  };

  const loadProfile = async () => {
    try {
      const id = await ensureId();
      if (!id) {
        Alert.alert('Error', 'Tutor ID not found');
        navigation.goBack();
        return;
      }
      const res = await fetch(`${BASE_URL}/api/tutors/${id}`);
      const data = await res.json();

      // hydrate form
      setName(data?.name || '');
      setEmail(data?.email || '');
      setNIC(data?.nic || '');
      setQualification(data?.qualification || '');
      setSubjectsText(Array.isArray(data?.subjects) ? data.subjects.join(', ') : (data?.subjects || ''));
      setGender(data?.gender || null);
      setAvailability(Array.isArray(data?.availability) ? data.availability : []);
      setGrades(Array.isArray(data?.grades) ? data.grades : []);
      setFee((data?.fee ?? '') === '' ? '' : String(data.fee));
      setLocation(data?.location || '');
      setAvatar(data?.profileImage || null);
    } catch (e) {
      console.error('Load tutor failed:', e);
      Alert.alert('Error', 'Failed to load tutor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to change your profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      setAvatarChanged(true);
    }
  };

  const uploadAvatarIfNeeded = async (id) => {
    if (!avatarChanged || !avatar) return null;
    const form = new FormData();
    form.append('image', {
      uri: avatar,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });
    const resp = await fetch(`${BASE_URL}/api/tutors/upload/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: form,
    });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json?.message || 'Upload failed');
    return json.imageUrl; // server returns relative path
  };

  const updateTutorProfile = async (id, payload) => {
    // Try the common route first, then a fallback
    const endpoints = [
      `${BASE_URL}/api/tutor/${id}`,
      `${BASE_URL}/api/auth/tutors/update/${id}`,
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) return data;
      } catch (e) {
        // try next
      }
    }
    throw new Error('No update endpoint responded OK. Please add/enable a tutor update route.');
  };

  const handleSave = async () => {
    const id = await ensureId();
    if (!id) return;

    if (!name || !email || !gender || availability.length === 0) {
      return Alert.alert('Missing info', 'Please fill required fields (name, email, gender, availability).');
    }

    setSaving(true);
    try {
      // step 1: optional avatar upload
      const uploaded = await uploadAvatarIfNeeded(id);

      // step 2: prepare payload
      const subjectsArray =
        subjectsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

      const payload = {
        name,
        email,
        nic,
        qualification,
        subjects: subjectsArray,
        gender,
        availability,
        grades,
        fee: fee === '' ? null : Number(fee),
        location,
      };

      // include profileImage path if uploaded
      if (uploaded) {
        payload.profileImage = uploaded; // server should store and serve this path
      }

      await updateTutorProfile(id, payload);

      Alert.alert('Saved', 'Your profile has been updated.');
      setAvatarChanged(false);
      onSaved?.();
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Update failed', e.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const avatarUri = resolveImage(avatar);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#088F9E', fontWeight: '700' }}>Loading…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.85}>
            <Ionicons name="arrow-back" size={20} color="#0B3E45" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Image
            source={avatarUri ? { uri: `${avatarUri}?t=${Date.now()}` } : require('../assets/images/avatar.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraFab} onPress={pickAvatar} activeOpacity={0.85}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Card: Basic */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Info</Text>
          <TextInput style={styles.input} placeholder="Full Name*" value={name} onChangeText={setName} />
          <TextInput
            style={styles.input}
            placeholder="Email*"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput style={styles.input} placeholder="NIC Number" value={nic} onChangeText={setNIC} />
          <TextInput
            style={styles.input}
            placeholder="Highest Qualification"
            value={qualification}
            onChangeText={setQualification}
          />
        </View>

        {/* Card: Teaching */}
        <View style={[styles.card, { zIndex: 12 }]}>
          <Text style={styles.cardTitle}>Teaching</Text>

          <TextInput
            style={styles.input}
            placeholder="Subjects (comma separated)"
            value={subjectsText}
            onChangeText={setSubjectsText}
          />

          {/* Gender */}
          <View style={{ zIndex: 12 }}>
            <DropDownPicker
              open={genderOpen}
              value={gender}
              items={genderOptions}
              setOpen={setGenderOpen}
              setValue={setGender}
              placeholder="Select Gender*"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onGenderOpen}
              listMode="SCROLLVIEW"
            />
          </View>

          {/* Availability (multi) */}
          <View style={{ zIndex: 11 }}>
            <DropDownPicker
              multiple
              min={1}
              max={4}
              open={availOpen}
              value={availability}
              items={availabilityOptions}
              setOpen={setAvailOpen}
              setValue={setAvailability}
              placeholder="Available Time(s)*"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onAvailOpen}
              listMode="SCROLLVIEW"
            />
          </View>

          {/* Grades (multi) */}
          <View style={{ zIndex: 10 }}>
            <DropDownPicker
              multiple
              open={gradesOpen}
              value={grades}
              items={gradeOptions}
              setOpen={setGradesOpen}
              setValue={setGrades}
              placeholder="Grades you teach"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onGradesOpen}
              listMode="SCROLLVIEW"
            />
          </View>
        </View>

        {/* Card: Extras */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Extra</Text>
          <TextInput
            style={styles.input}
            placeholder="Location (e.g., Colombo)"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Hourly Fee (LKR)"
            value={fee}
            onChangeText={(t) => setFee(t.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
