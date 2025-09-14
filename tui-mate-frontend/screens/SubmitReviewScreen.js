import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/SubmitReviewStyles';

export default function SubmitReviewScreen({ route, navigation }) {
  const { tutorId, tutorName, studentId, classId } = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      Alert.alert('Error', 'Please provide both rating and comment');
      return;
    }

    try {
      const res = await fetch('http://172.20.10.3:5000/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, tutorId, classId, rating, comment }),
      });

      const data = await res.json();

      if (res.status === 201) {
        Alert.alert('Success', 'Your review was submitted');
        navigation.navigate('BookingRequestsStudent', { studentId });
      } else {
        Alert.alert('Error', data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      Alert.alert('Error', 'Network error');
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <Ionicons
          name={star <= rating ? 'star' : 'star-outline'}
          size={32}
          color="#FFD700"
          style={{ marginHorizontal: 5 }}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#5A83EC" />
      </TouchableOpacity>

      <Text style={styles.title}>Review {tutorName}</Text>

      <View style={styles.starsRow}>{renderStars()}</View>

      <TextInput
        style={styles.input}
        placeholder="Write your review..."
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
}
