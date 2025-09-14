import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, Platform, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function StudentEditProfileScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch profile data when screen comes into focus (with refresh param)
  useFocusEffect(
    React.useCallback(() => {
      fetch(`http://172.20.10.3:5000/api/auth/students/${studentId}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name || '');
          setEmail(data.email || '');
          setGrade(data.grade || '');
     setProfileImage(
  data.profileImage?.includes('http')
    ? data.profileImage
    : `http://172.20.10.3:5000/${data.profileImage?.replace(/\\/g, '/')}`
);



          setLoading(false);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setLoading(false);
        });
    }, [studentId, route.params?.refresh])
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('grade', grade);

    if (profileImage && !profileImage.includes('http')) {
      const filename = profileImage.split('/').pop();
      const type = `image/${filename.split('.').pop()}`;
      formData.append('profileImage', {
        uri: profileImage,
        name: filename,
        type,
      });
    }

    try {
      const res = await fetch(`http://172.20.10.3:5000/api/auth/students/update/${studentId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.navigate('StudentEditProfile', {
          studentId,
          refresh: Date.now(), // ✅ Trigger refetch
        });
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#088F9E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Your Profile</Text>

      <View style={styles.avatarWrapper}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/images/avatar.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Name" />
        <Ionicons name="person" size={18} color="#999" style={styles.inputIcon} />
      </View>

      <View style={styles.inputGroup}>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Email" />
        <Ionicons name="mail" size={18} color="#999" style={styles.inputIcon} />
      </View>

      <View style={styles.inputGroup}>
        <TextInput value={grade} onChangeText={setGrade} style={styles.input} placeholder="Grade" />
        <Ionicons name="school" size={18} color="#999" style={styles.inputIcon} />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 24,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#088F9E',
    marginVertical: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#088F9E',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#088F9E',
    borderRadius: 14,
    padding: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
    position: 'relative',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingLeft: 16,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 16 : 12,
  },
  updateButton: {
    backgroundColor: '#088F9E',
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#088F9E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  updateText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});
