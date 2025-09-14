import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/TutorSignupStyles';

export default function TutorSignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNIC] = useState('');
  const [qualification, setQualification] = useState('');
  const [subjects, setSubjects] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  // Gender
  const [gender, setGender] = useState(null);
  const [genderOpen, setGenderOpen] = useState(false);
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  // Availability (multi-select) — you already used openStudy for this; kept same
  const [availability, setAvailability] = useState([]);
  const availabilityOptions = [
    { label: 'Morning', value: 'Morning' },
    { label: 'Afternoon', value: 'Afternoon' },
    { label: 'Evening', value: 'Evening' },
    { label: 'Night', value: 'Night' },
  ];
  const [openStudy, setOpenStudy] = useState(false); // existing name kept

  // Study time (single-select) — same fields you had
  const [studyTime, setStudyTime] = useState(null);
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyOptions, setStudyOptions] = useState([
    { label: 'Morning', value: 'Morning' },
    { label: 'Afternoon', value: 'Afternoon' },
    { label: 'Evening', value: 'Evening' },
    { label: 'Night', value: 'Night' },
  ]);

  // Ensure only one dropdown opens at a time (prevents layout thrash)
  const onGenderOpen = useCallback(() => {
    setOpenStudy(false);
    setStudyOpen(false);
  }, []);
  const onAvailOpen = useCallback(() => {
    setGenderOpen(false);
    setStudyOpen(false);
  }, []);
  const onStudyOpen = useCallback(() => {
    setGenderOpen(false);
    setOpenStudy(false);
  }, []);

  const closeAllDropdowns = () => {
    setGenderOpen(false);
    setOpenStudy(false);
    setStudyOpen(false);
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to upload your NIC image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (
      !name || !email || !nic || !qualification || !subjects || !password ||
      !image || !gender || availability.length === 0
    ) {
      return Alert.alert('Missing info', 'Please fill all fields and upload your NIC image.');
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('nic', nic);
      formData.append('qualification', qualification);
      formData.append('subjects', subjects);
      formData.append('password', password);
      formData.append('availability', JSON.stringify(availability));
      formData.append('gender', gender);
      formData.append('studyTime', studyTime);
      formData.append('nicImage', {
        uri: image,
        type: 'image/jpeg',
        name: 'nic.jpg',
      });

      const response = await fetch('http://172.20.10.3:5000/api/auth/tutors/signup', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Submitted', 'Your details have been submitted. Admin will review and approve within 24 hours.');
        navigation.navigate('TutorLogin');
      } else {
        Alert.alert('Signup failed', data.message || 'Please try again.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network error', 'Please check your connection and try again.');
    }
  };

  const inputProps = {
    onFocus: closeAllDropdowns, // prevent dropdowns from messing with keyboard focus
    placeholderTextColor: '#7c8a94',
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // prevents Android keyboard flicker
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="always"
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Image source={require('../assets/images/student-signup.png')} style={styles.image} />
          <Text style={styles.heading}>Tutor Sign Up</Text>

          <TextInput style={styles.input} placeholder="Role: Tutor" editable={false} />
          <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} {...inputProps} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" {...inputProps} />
          <TextInput style={styles.input} placeholder="NIC Number" value={nic} onChangeText={setNIC} {...inputProps} />
          <TextInput style={styles.input} placeholder="Highest Qualification" value={qualification} onChangeText={setQualification} {...inputProps} />
          <TextInput style={styles.input} placeholder="Teaching Subjects (comma separated)" value={subjects} onChangeText={setSubjects} {...inputProps} />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry {...inputProps} />

                 {/* Gender (inline dropdown) */}
          <View style={styles.dropdownWrapperTop}>
            <DropDownPicker
              open={genderOpen}
              value={gender}
              items={genderOptions}
              setOpen={setGenderOpen}
              setValue={setGender}
              placeholder="Select Gender"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="SCROLLVIEW"                 // inline, not modal
              dropDownDirection="AUTO"
              onOpen={onGenderOpen}
              scrollViewProps={{ nestedScrollEnabled: true }}
            />
          </View>

          {/* Availability (multi-select inline) */}
          <View style={styles.dropdownWrapperMid}>
            <DropDownPicker
              multiple
              min={1}
              max={4}
              open={openStudy}
              setOpen={setOpenStudy}
              value={availability}
              setValue={setAvailability}
              items={availabilityOptions}
              placeholder="Select Available Time(s)"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="SCROLLVIEW"
              dropDownDirection="AUTO"
              onOpen={onAvailOpen}
              scrollViewProps={{ nestedScrollEnabled: true }}
            />
          </View>

          {/* Study Time (single-select inline) */}
          <View style={styles.dropdownWrapperLow}>
            <DropDownPicker
              open={studyOpen}
              value={studyTime}
              items={studyOptions}
              setOpen={setStudyOpen}
              setValue={setStudyTime}
              setItems={setStudyOptions}
              placeholder="Preferred Study Time"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="SCROLLVIEW"
              dropDownDirection="AUTO"
              onOpen={onStudyOpen}
              scrollViewProps={{ nestedScrollEnabled: true }}
            />
          </View>



          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>
              {image ? 'NIC Image Selected ✅' : 'Upload NIC Image'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Submit for Approval</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('TutorLogin')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
