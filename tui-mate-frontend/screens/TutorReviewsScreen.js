import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TutorReviewsScreen({ route }) {
  const { tutorId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://172.20.10.3:5000/api/reviews/tutor/${tutorId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [tutorId]);

  const renderStars = (rating) => {
    return [1,2,3,4,5].map(star => (
      <Ionicons
        key={star}
        name={star <= rating ? 'star' : 'star-outline'}
        size={20}
        color="#FFD700"
      />
    ));
  };

  if (loading) return <ActivityIndicator size="large" color="#5A83EC" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reviews</Text>

      {/* Average rating display */}
      <View style={styles.avgRatingContainer}>
        <Text style={styles.avgRatingText}>
          {avgRating ? avgRating.toFixed(1) : "0.0"}
        </Text>
        <View style={styles.starsRow}>
          {renderStars(Math.round(avgRating || 0))}
        </View>
        <Text style={styles.totalReviewsText}>
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </Text>
      </View>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <Text>No reviews yet</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <Text style={styles.studentName}>{item.student?.name || "Anonymous"}</Text>
              <View style={styles.starsRow}>
                {renderStars(Math.round(item?.rating || 0))}
              </View>
              <Text style={styles.comment}>{item.comment || "No comment"}</Text>
              <Text style={styles.date}>
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:15 },
  avgRatingContainer: { alignItems:'center', marginBottom:20 },
  avgRatingText: { fontSize:40, fontWeight:'bold', color:'#5A83EC' },
  starsRow: { flexDirection:'row', marginVertical:5 },
  totalReviewsText: { fontSize:14, color:'#555' },
  reviewCard: { borderWidth:1, borderColor:'#ccc', padding:15, borderRadius:8, marginBottom:10 },
  studentName: { fontWeight:'bold', fontSize:16 },
  comment: { fontSize:14, marginBottom:5 },
  date: { fontSize:12, color:'#555' },
});
