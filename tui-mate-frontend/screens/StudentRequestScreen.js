import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../styles/StudentRequestStyles';
import { Ionicons } from '@expo/vector-icons';

// put this near the top of the file (below imports)
const BASE_URL = 'http://172.20.10.3:5000';
const resolveImage = (imgPath) => {
  if (!imgPath) return null;
  const clean = String(imgPath).replace(/\\/g, '/');         // fix Windows slashes
  return clean.startsWith('http') ? clean : `${BASE_URL}/${clean}`;
};


export default function StudentRequestsScreen({ route, navigation }) {
  const { tutorId } = route.params;
  const [bookings, setBookings] = useState([]);
  

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://172.20.10.3:5000/api/bookings/tutor/${tutorId}/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAccept = async (bookingId) => {
    try {
      await fetch(`http://172.20.10.3:5000/api/bookings/${bookingId}/accept`, {
        method: 'PATCH',
      });
      Alert.alert('Accepted', 'Booking has been accepted');
      fetchBookings();
    } catch (err) {
      console.error('Error accepting booking:', err);
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      await fetch(`http://172.20.10.3:5000/api/bookings/${bookingId}/decline`, {
        method: 'PATCH',
      });
      Alert.alert('Declined', 'Booking has been declined');
      fetchBookings();
    } catch (err) {
      console.error('Error declining booking:', err);
    }
  };

  const chipStyleFor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'accepted') return [styles.statusChip, styles.statusAccepted];
    if (s === 'declined' || s === 'cancelled') return [styles.statusChip, styles.statusDeclined];
    return [styles.statusChip, styles.statusPending]; // default: Pending
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('TutorDashboard', { tutorId })}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Student Requests</Text>
          <Text style={styles.headerSubtitle}>Review & manage new bookings</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={fetchBookings} activeOpacity={0.8}>
          <Ionicons name="refresh" size={20} color="#0B3E45" />
        </TouchableOpacity>
      </View>

      {/* Count pill */}
      <View style={styles.countRow}>
        <View style={styles.countPill}>
          <Ionicons name="people-outline" size={14} color="#0B3E45" />
          <Text style={styles.countText}>{bookings?.length || 0} request(s)</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {(!bookings || bookings.length === 0) ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="mail-open-outline" size={40} color="#3CAEFF" />
            </View>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyText}>You’ll see new student bookings here.</Text>
          </View>
        ) : (
          bookings.map((booking) => {
            const studentName = booking?.studentId?.name || 'Student';
  const date = booking?.classId?.date || '—';
  const time = booking?.classId?.startTime || '—';
  const grade = booking?.classId?.grade || '—';
  const status = booking?.status || 'Pending';

            // ✅ compute the photo for THIS booking
  const photoUri = resolveImage(booking?.studentId?.profileImage);

  return (
    <View key={booking._id} style={styles.requestCard}>
      <View style={styles.cardAccent} />

      <Image
        source={
          photoUri
            ? { uri: `${photoUri}?t=${Date.now()}` }
            : require('../assets/images/avatar.png')
        }
        style={styles.avatar}
        defaultSource={require('../assets/images/avatar.png')}
        onError={() => {/* optional: log image load error */}}
      />


                {/* info */}
                <View style={styles.info}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.name} numberOfLines={1}>{studentName}</Text>
                    <View style={chipStyleFor(status)}>
                      <Ionicons name="ellipse" size={6} color="rgba(0,0,0,0.35)" />
                      <Text style={styles.statusText}>{status}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{date}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{time}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="school-outline" size={16} color="#64748b" />
                    <Text style={styles.detailText}>Grade {grade}</Text>
                  </View>

                  {/* actions */}
                  {status === 'Pending' && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.acceptButton]}
                        onPress={() => handleAccept(booking._id)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="#fff" />
                        <Text style={styles.actionText}>Accept</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, styles.declineButton]}
                        onPress={() => handleDecline(booking._id)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="close-circle" size={18} color="#fff" />
                        <Text style={styles.actionText}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}
