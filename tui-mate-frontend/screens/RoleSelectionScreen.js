import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/RoleSelectionStyles'; // 👈 Import your external styles
import { Ionicons } from '@expo/vector-icons'; // for the back icon

export default function RoleSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('GetStarted')}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.welcome}>Welcome !</Text>
      <Text style={styles.subheading}>Select Your Role To Continue</Text>

      {/* Student */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('StudentSignup')}>
        <Image source={require('../assets/images/student.png')} style={styles.imageStudent}/>
        <View style={styles.textContainer}>
          <Text style={styles.roleTitle}>Student</Text>
          <Text style={styles.roleDescription}>Search tutors, book classes, and track progress</Text>
        </View>
      </TouchableOpacity>

      {/* Tutor */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TutorSignup')}>
        <Image source={require('../assets/images/Tutor.png')} style={styles.imageTutor} />
        <View style={styles.textContainer}>
          <Text style={styles.roleTitle}>Tutor</Text>
          <Text style={styles.roleDescription}>Manage your class schedule and connect with students</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
