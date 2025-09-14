import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import styles from '../styles/TutorDetailsStyles';

const getClassId = (c) => (c?._id ?? c?.id ?? null);

export default function TutorDetailsScreen({ route, navigation }) {
  const { tutorId, subject, studentId } = route.params;
  const [tutorDetails, setTutorDetails] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [futureClasses, setFutureClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const res = await fetch(`http://172.20.10.3:5000/api/tutor/${tutorId}/details?subject=${subject}`);
        const data = await res.json();
        setTutorDetails(data);

        const future = (data.classes || []).filter(cls => {
          const [year, month, day] = String(cls.date).split('-').map(Number);
          const [hour, minute] = String(cls.startTime || '00:00').split(':').map(Number);
          const classDateTime = new Date(year, (month || 1) - 1, day || 1, hour || 0, minute || 0);
          return classDateTime > new Date();
        });
        setFutureClasses(future);
        // Do NOT preselect — user picks a time slot
        // setSelectedClassId(getClassId(future?.[0]) ?? null);
      } catch (err) {
        console.error('Error fetching tutor details:', err);
        Alert.alert('Error', 'Could not load tutor details');
      }
    };
    fetchTutorDetails();
  }, [tutorId, subject]);

  // choose what the map should center on (selected class if any, else first future)
  const selectedClass =
    futureClasses.find(c => getClassId(c) === selectedClassId) || futureClasses[0];

  const mapLatitude  = typeof selectedClass?.latitude  === 'number' ? selectedClass.latitude  : 7.8731;
  const mapLongitude = typeof selectedClass?.longitude === 'number' ? selectedClass.longitude : 80.7718;
  const mapKey = getClassId(selectedClass) || 'no-selection';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://172.20.10.3:5000/api/reviews/tutor/${tutorId}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [tutorId]);

  if (!tutorDetails) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.greenHeader} />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutor Profile</Text>
      </View>

      <View style={styles.profileCardContainer}>
        <View style={styles.profileCard}>
          <Image
            source={
              tutorDetails.profileImage
                ? { uri: `http://172.20.10.3:5000/${tutorDetails.profileImage}` }
                : require('../assets/images/avatar.png')
            }
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>Mr. {tutorDetails.name}</Text>
          <Text style={styles.profileSubject}>{subject}</Text>
          <Text style={styles.profileFee}>Fee: {tutorDetails.fee}/=</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { studentId, tutorId, userRole: 'Student' })}>
              <View style={styles.iconCircle1}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Only open/close the map here */}
            <TouchableOpacity onPress={() => setShowMap(prev => !prev)}>
              <View style={styles.iconCircle1}>
                <Ionicons name="location-outline" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showMap && (
        <MapView
          style={{ height: 200, marginTop: 10 }}
          key={mapKey} // recenter when selection changes
          initialRegion={{
            latitude: mapLatitude,
            longitude: mapLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: mapLatitude, longitude: mapLongitude }}
            title="Tuition Location"
            description={String(selectedClass?.location || tutorDetails.location || 'Location not provided')}
          />
        </MapView>
      )}

      <Text style={styles.sectionTitle2}></Text>
      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <View style={styles.statsIconCircle}>
            <Ionicons name="book-outline" size={18} color="#088F9E" />
          </View>
          <Text style={styles.statsValue}>{tutorDetails.classes?.length || 0}</Text>
          <Text style={styles.statsLabel}>Classes</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsIconCircle}>
            <Ionicons name="briefcase-outline" size={18} color="#088F9E" />
          </View>
          <Text style={styles.statsValue}>10+</Text>
          <Text style={styles.statsLabel}>Years Exp.</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsIconCircle}>
            <Ionicons name="star-outline" size={18} color="#088F9E" />
          </View>
          <Text style={styles.statsValue}>{tutorDetails.rating?.value?.toFixed(1)}</Text>
          <Text style={styles.statsLabel}>Rating</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsIconCircle}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#088F9E" />
          </View>
          <Text style={styles.statsValue}>{tutorDetails.rating?.count || 0}</Text>
          <Text style={styles.statsLabel}>Reviews</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Class Times</Text>
      <View>
        {futureClasses.length > 0 ? (
          futureClasses.map((cls, index) => {
            const day = new Date(cls.date).toLocaleDateString('en-US', { weekday: 'long' });
            const id = getClassId(cls);
            const isSelected = selectedClassId === id;

            return (
              <TouchableOpacity
                key={id || index}
                style={[styles.classTimeCard, isSelected && styles.selectedCard]}
                onPress={() => {
                  setSelectedClassId(prev => (prev === id ? null : id)); // toggle select
                }}
              >
                <View style={[styles.iconCircle, isSelected && { backgroundColor: '#fff' }]}>
                  <Ionicons name="time-outline" size={20} color="#088F9E" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.availabilityLabel, isSelected && styles.selectedText]}>
                    {day}
                  </Text>
                  <Text style={[styles.availabilityTime, isSelected && styles.selectedText]}>
                    {cls.startTime} - {cls.endTime || 'N/A'}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={isSelected ? '#fff' : '#aaa'} />
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={{ textAlign: 'center' }}>No upcoming classes available</Text>
        )}
      </View>

      <View style={styles.sectionTabs}>
        <TouchableOpacity onPress={() => setActiveTab('about')} style={[styles.tabButton, activeTab === 'about' && styles.activeTab]}>
          <Text style={[styles.tabButtonText, activeTab === 'about' && styles.activeTabText]}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('reviews')} style={[styles.tabButton, activeTab === 'reviews' && styles.activeTab]}>
          <Text style={[styles.tabButtonText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'about' && (
        <>
          <Text style={styles.sectionTitle}>About the tutor</Text>
          <Text style={styles.aboutText}>
            Experienced A/L and O/L Maths tutor with 10+ years of success. Specializes in Algebra and Calculus. Known for clear teaching and helping students score high.
          </Text>
        </>
      )}

      {activeTab === 'reviews' && (
        <View>
          <Text style={styles.sectionTitle}>Student Reviews</Text>
          {reviews.length === 0 ? (
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>No reviews yet.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewScrollContainer}
            >
              {reviews.map((review, index) => (
                <View key={index} style={styles.reviewCardGreen}>
                  <Image
                    source={require('../assets/images/avatar.png')}
                    style={styles.reviewCardAvatar}
                  />
                  <View style={styles.reviewCardRightSection}>
                    <View style={styles.reviewCardRowTop}>
                      <Text style={styles.reviewCardName}>{review.student?.name || 'Anonymous'}</Text>
                    </View>

                    <Text style={styles.reviewCardRatingStars}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Text key={i} style={{ marginHorizontal: 1 }}>
                          {i < review.rating ? '★' : '☆'}
                        </Text>
                      ))}
                    </Text>

                    <Text style={styles.reviewCardText}>{review.comment}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.bookButton, { backgroundColor: selectedClassId ? '#088F9E' : '#ccc' }]}
        onPress={() => {
          if (!selectedClassId) {
            return Alert.alert('Please select a class time to book');
          }
          const selected = futureClasses.find(cls => getClassId(cls) === selectedClassId);
          if (!selected) {
            return Alert.alert('Error', 'Selected class not found.');
          }

          navigation.navigate('ConfirmBooking', {
            studentId,
            tutorId,
            tutorName: tutorDetails.name,
            profileImage: tutorDetails.profileImage,
            classId: getClassId(selected), // important
            subject,
            date: selected.date,
            startTime: selected.startTime,
            endTime: selected.endTime,
            fee: selected.fee ?? tutorDetails.fee, // may be undefined; Confirm screen re-fetches anyway
            latitude: selected.latitude,
            longitude: selected.longitude,
          });
        }}
      >
        <Text style={styles.bookButtonText}>Book Tutor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
