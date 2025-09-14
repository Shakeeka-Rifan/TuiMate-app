import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../styles/StudentQuizPreferencesStyles';

export default function StudentQuizPreferencesScreen({ route, navigation }) {
  const { studentId, selectedSubjects } = route.params;

  const [studyTimeOpen, setStudyTimeOpen] = useState(false);
  const [studyTime, setStudyTime] = useState([]);
  const [studyTimeOptions] = useState([
    { label: 'Morning', value: 'Morning' },
    { label: 'Afternoon', value: 'Afternoon' },
    { label: 'Evening', value: 'Evening' },
    { label: 'Night', value: 'Night' },
  ]);

  const [classTypeOpen, setClassTypeOpen] = useState(false);
  const [classType, setClassType] = useState(null);
  const [classTypes] = useState([
    { label: 'Group', value: 'Group' },
    { label: 'Individual', value: 'Individual' },
  ]);

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderPreference, setGenderPreference] = useState(null);
  const [genderOptions] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ]);

  const handleSubmit = async () => {
    if (!studyTime.length || !classType || !genderPreference) {
      return Alert.alert('Error', 'Please complete all preferences.');
    }

    const quizData = {
      subjects: selectedSubjects,
      studyTime,
      classType,
      genderPreference,
    };

    try {
      const response = await fetch(`http://172.20.10.3:5000/api/student/preferences/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Preferences saved!');
        navigation.navigate('StudentDashboard', { studentId });
      } else {
        Alert.alert('Error', data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      Alert.alert('Network Error', 'Could not save preferences');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <View style={styles.quizBox}>
        <View style={styles.questionHeader}>
         <Text style={styles.questionNumber}>02</Text>
        <Text style={styles.title}>Student Preferences Quiz</Text>
</View>
        <Text style={styles.label}>Preferred Study Time</Text>
         <View style={{ zIndex: 3000 }}>
        <DropDownPicker
          multiple={true}
          open={studyTimeOpen}
          value={studyTime}
          items={studyTimeOptions}
          setOpen={setStudyTimeOpen}
          setValue={setStudyTime}
          setItems={() => {}}
          placeholder="Select Available Times"
            textStyle={{
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#033D3F',
  }}
  labelStyle={{
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#000000ff',
  }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
        </View>

        <Text style={styles.label}>Class Type Preference</Text>
         <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={classTypeOpen}
          value={classType}
          items={classTypes}
          setOpen={setClassTypeOpen}
          setValue={setClassType}
          setItems={() => {}}
          placeholder="Select Class Type"
            textStyle={{
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#033D3F',
  }}
  labelStyle={{
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#000000ff',
  }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
        </View>

        <Text style={styles.label}>Preferred Tutor Gender</Text>
          <View style={{ zIndex: 1000 }}>
        <DropDownPicker
          open={genderOpen}
          value={genderPreference}
          items={genderOptions}
          setOpen={setGenderOpen}
          setValue={setGenderPreference}
          setItems={() => {}}
          placeholder="Select Gender"
            textStyle={{
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#033D3F',
  }}
  labelStyle={{
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#000000ff',
  }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Finish Quiz</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
