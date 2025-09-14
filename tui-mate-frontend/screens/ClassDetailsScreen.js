import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/ClassDetailsStyles'; // You can create this style file

export default function ClassDetailsScreen({ route, navigation }) {
  const {
    classId,
    subject,
    grade,
    batchSize,
    date,
    startTime,
    fee,
    tutorId
  } = route.params;

  const handleMarkCompleted = async () => {
    Alert.alert(
      'Mark as Completed',
      'Are you sure you want to mark this class as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, mark completed',
          onPress: async () => {
            try {
              const res = await fetch(`http://172.20.10.3:5000/api/classes/${classId}/complete`, {
                method: 'PATCH',
              });

              const data = await res.json();
              if (res.ok) {
                Alert.alert('Success', 'Class marked as completed');
                navigation.goBack();
              } else {
                Alert.alert('Error', data.message || 'Error marking class completed');
              }
            } catch (err) {
              console.error('Error marking completed:', err);
              Alert.alert('Error', 'Network error');
            }
          },
        },
      ]
    );
  };

  const handleCancelClass = async () => {
    Alert.alert(
      'Cancel Class',
      'Are you sure you want to cancel this class?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, cancel class',
          onPress: async () => {
            try {
              const res = await fetch(`http://172.20.10.3:5000/api/classes/${classId}/cancel`, {
                method: 'PATCH',
              });

              const data = await res.json();
              if (res.ok) {
                Alert.alert('Success', 'Class cancelled');
                navigation.goBack();
              } else {
                Alert.alert('Error', data.message || 'Error cancelling class');
              }
            } catch (err) {
              console.error('Error cancelling class:', err);
              Alert.alert('Error', 'Network error');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('TutorTimeTable', { tutorId })}>
                       <Ionicons name="arrow-back" size={24} color="white" />
                     </TouchableOpacity>


      <View style={styles.classCard}>
        <Text style={styles.classSubject}>{subject}</Text>
        <Text style={styles.classDetail}>Grade {grade}</Text>
        <Text style={styles.classDetail}>{batchSize} Students</Text>
        <Text style={styles.classDetail}>Date: {date} {startTime}</Text>
        <Text style={styles.classDetail}>Fee: Rs. {fee}/=</Text>

        {/* Students section (optional) */}
        <Text style={styles.studentsTitle}>Students</Text>
        <View style={styles.studentsRow}>
          {/* Dummy students avatars */}
          {[1, 2, 3, 4].map((_, index) => (
            <Image
              key={index}
              source={require('../assets/images/avatar.png')}
              style={styles.studentAvatar}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleMarkCompleted}
          
          >
            <Text style={styles.buttonText}>Mark as completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelClass}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
