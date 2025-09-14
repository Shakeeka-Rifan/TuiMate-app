import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import styles from '../styles/StudentQuizStyles';

export default function StudentQuizSubjectsScreen({ route, navigation }) {
  const studentId = route.params?.studentId;
  const subjectOptions = ['Maths', 'Science', 'English', 'ICT', 'Sinhala'];
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const goToPreferences = () => {
    if (!selectedSubjects.length) {
      alert('Please select at least one subject');
      return;
    }

    navigation.navigate('StudentQuizPreferences', {
      studentId,
      selectedSubjects,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.quizCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>01</Text>
              <Text style={styles.questionText}>Let's personalize your learning experience!</Text>
            </View>

            <Text style={styles.label}>Subjects you need help with:</Text>
            {subjectOptions.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionContainer}
                onPress={() => toggleSubject(subject)}
              >
                <View style={styles.optionCircle}>
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={styles.optionLabel}>{subject}</Text>
                <Checkbox
                  value={selectedSubjects.includes(subject)}
                  onValueChange={() => toggleSubject(subject)}
                  style={styles.checkbox}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.button} onPress={goToPreferences}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
