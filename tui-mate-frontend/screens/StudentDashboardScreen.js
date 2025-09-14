import React, { useEffect, useState, useRef, useMemo } from 'react';
import FloatingChatButton from '../components/FloatingChatButton';
import * as Location from 'expo-location';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/StudentDashboardStyles';

import { PanResponder } from 'react-native';
import Draggable from 'react-native-draggable';
import io from 'socket.io-client';
const socket = io('http://172.20.10.3:5000');

/* ---------- helpers (UNCHANGED) ---------- */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getBestCoords = (tutor) => {
  const now = new Date();
  if (Array.isArray(tutor.classes) && tutor.classes.length) {
    const toDate = (c) => new Date(`${c.date}T${c.startTime || '00:00'}`);
    const next = tutor.classes.find(
      (c) => c.latitude && c.longitude && toDate(c) >= now
    );
    if (next) return { lat: next.latitude, lng: next.longitude };
    const any = tutor.classes.find((c) => c.latitude && c.longitude);
    if (any) return { lat: any.latitude, lng: any.longitude };
  }
  if (tutor.classLatitude && tutor.classLongitude) {
    return { lat: tutor.classLatitude, lng: tutor.classLongitude };
  }
  if (tutor.latitude && tutor.longitude) {
    return { lat: tutor.latitude, lng: tutor.longitude };
  }
  return { lat: null, lng: null };
};
/* ---------------------------------------- */

/* ---------- Skeletons (no libs) ---------- */
const Shine = ({ style }) => {
  const x = useRef(new Animated.Value(-50)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: 200, duration: 1200, useNativeDriver: true }),
        Animated.timing(x, { toValue: -50, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [x]);
  return <Animated.View style={[styles.shine, style, { transform: [{ translateX: x }] }]} />;
};

const TutorCardSkeleton = () => (
  <View style={styles.tutorCardPro}>
    <View style={styles.skelAvatar} />
    <View style={styles.skelLineWide} />
    <View style={styles.skelLine} />
    <View style={[styles.tag, { width: 90, height: 20 }]} />
    <View style={[styles.tagMuted, { width: 60, height: 20 }]} />
    <View style={[styles.tutorCTAPro, { backgroundColor: '#EAF6F7' }]} />
    <Shine style={{ top: 0 }} />
  </View>
);

const ClassCardSkeleton = () => (
  <View style={styles.classCardPro}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <View style={styles.skelClassAvatar} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={styles.skelLineWide} />
        <View style={styles.skelLine} />
      </View>
    </View>
    <View style={styles.skelLine} />
    <View style={[styles.classCTAPro, { backgroundColor: '#EAF6F7', marginTop: 12 }]} />
    <Shine style={{ top: 0 }} />
  </View>
);

/* Progress Snapshot skeleton */
const ProgressCardSkeleton = () => (
  <View style={styles.progressCard}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressTitle}>Progress Snapshot</Text>
      <View style={styles.progressRangePill} />
    </View>
    <View style={styles.progressRow}>
      <View style={styles.skelCircle} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={[styles.progressTrack, { overflow: 'hidden' }]}>
          <View style={[styles.skelFill]} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <View style={[styles.statPill, { width: 90, height: 26 }]} />
          <View style={[styles.statPill, { width: 90, height: 26 }]} />
          <View style={[styles.statPill, { width: 90, height: 26 }]} />
        </View>
      </View>
    </View>
    <Shine style={{ top: 0 }} />
  </View>
);
/* ---------------------------------------- */

export default function StudentDashboardScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [tutors, setTutors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [studentLocation, setStudentLocation] = useState(null);

  // NEW: All bookings for snapshot (same endpoint as Progress screen)
  const [allBookings, setAllBookings] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);

  // Toast
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastY = useRef(new Animated.Value(-60)).current;
  const showToast = (text) => {
    setToastText(text);
    setToastVisible(true);
    Animated.timing(toastY, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(toastY, { toValue: -60, duration: 200, useNativeDriver: true }).start(() => {
          setToastVisible(false);
          setToastText('');
        });
      }, 2500);
    });
  };

  // Parallax
  const scrollY = useRef(new Animated.Value(0)).current;
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -12],
    extrapolate: 'clamp',
  });
  const heroScale = scrollY.interpolate({
    inputRange: [-40, 0, 140],
    outputRange: [1.04, 1, 0.98],
    extrapolate: 'clamp',
  });

  // keep pan/drag logic intact (no behavior change)
  const pan = useRef(new Animated.ValueXY({ x: 250, y: 600 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  /* --------- fetch student (UNCHANGED) ---------- */
  useEffect(() => {
    fetch(`http://172.20.10.3:5000/api/auth/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent({
          ...data,
          profileImage: data.profileImage?.includes('http')
            ? data.profileImage
            : `http://172.20.10.3:5000/${data.profileImage?.replace(/\\/g, '/')}`,
        });
      })
      .catch((err) => console.error('Error fetching student profile:', err));
  }, [studentId]);

  /* --------- device location (UNCHANGED) ---------- */
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setStudentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  /* --------- recommended tutors (UNCHANGED) ---------- */
  useEffect(() => {
    fetch(`http://172.20.10.3:5000/api/student/recommended/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTutors(data);
        } else {
          console.warn('Expected an array but got:', data);
          setTutors([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tutors:', err);
        Alert.alert('Error', 'Failed to load recommended tutors.');
        setLoading(false);
      });
  }, [studentId]);

  /* --------- upcoming bookings (UNCHANGED) ---------- */
  useEffect(() => {
    fetch(
      `http://172.20.10.3:5000/api/bookings/student/${studentId}/bookings?filter=All&futureOnly=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUpcomingBookings(data);
        } else {
          console.warn('Expected an array but got:', data);
          setUpcomingBookings([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching upcoming bookings:', err);
        setUpcomingBookings([]);
      });
  }, [studentId]);

  /* --------- NEW: all bookings for Progress Snapshot (same as Progress page) ---------- */
  useEffect(() => {
    setProgressLoading(true);
    fetch(`http://172.20.10.3:5000/api/bookings/student/${studentId}/bookings`)
      .then((res) => res.json())
      .then((data) => setAllBookings(Array.isArray(data) ? data : []))
      .catch((e) => {
        console.error('Student progress fetch failed:', e);
        setAllBookings([]);
      })
      .finally(() => setProgressLoading(false));
  }, [studentId]);

  /* --------- socket notifications (UNCHANGED + toast) ---------- */
  useEffect(() => {
    if (!studentId) return;
    const handleMessage = (msg) => {
      if (msg.receiverId === studentId) {
        setNotifications((prev) => [...prev, msg]);
        showToast('New message received');
      }
    };
    socket.on('receiveMessage', handleMessage);
    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [studentId]);

  /* --------- Derived snapshot metrics (easy + visual) ---------- */
  const today = new Date();
  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  const isWithin = (date, a, b) => date >= a && date <= b;

  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date(0);
    let d = new Date(dateStr);
    if (isNaN(d)) {
      const parts = String(dateStr).split(/[-/]/);
      if (parts.length >= 3) {
        let y, m, day;
        if (parts[0].length === 4) {
          y = +parts[0]; m = +parts[1]; day = parseInt(parts[2], 10);
        } else {
          day = +parts[0]; m = +parts[1]; y = parseInt(parts[2], 10);
        }
        d = new Date(y, (m || 1) - 1, day || 1);
      } else {
        d = new Date(0);
      }
    }
    if (timeStr) {
      const [hh = '0', mm = '0'] = String(timeStr).split(':');
      d.setHours(parseInt(hh, 10) || 0, parseInt(mm, 10) || 0, 0, 0);
    }
    return d;
  };
  const minutesBetween = (start, end) => Math.max(0, Math.round((end - start) / 60000));
  const isAccepted = (b) => String(b?.status || '').toLowerCase() === 'accepted';
  const isCancelled = (b) =>
    ['cancelled', 'declined'].includes(String(b?.status || '').toLowerCase());
  const attended = (b) => {
    const s = String(b?.status || '').toLowerCase();
    const a = String(b?.attendanceStatus || '').toLowerCase();
    return s === 'completed' || a === 'present' || a === 'attended' || a === 'completed';
  };

  const normalized = useMemo(() => {
    return allBookings.map((b) => {
      const cls = b?.classId || {};
      const start = parseDateTime(cls.date, cls.startTime);
      const end = parseDateTime(cls.date, cls.endTime || cls.startTime);
      const subject = cls.subject || 'Class';
      const grade = cls.grade || '—';
      return { raw: b, start, end, subject, grade };
    });
  }, [allBookings]);

  const monthBounds = useMemo(
    () => ({ from: startOfMonth(today), to: endOfMonth(today) }),
    [today]
  );

  const monthBookings = useMemo(
    () => normalized.filter((n) => isWithin(n.start, monthBounds.from, monthBounds.to)),
    [normalized, monthBounds]
  );

  const snapshot = useMemo(() => {
    let attendedCount = 0, cancelled = 0, minutes = 0, upcoming = 0;
    const subjCounts = {};

    monthBookings.forEach((n) => {
      const b = n.raw;
      subjCounts[n.subject] = (subjCounts[n.subject] || 0) + 1;
      if (attended(b)) {
        attendedCount++;
        minutes += minutesBetween(n.start, n.end);
      } else if (isCancelled(b)) {
        cancelled++;
      } else if (isAccepted(b) && n.start >= today) {
        upcoming++;
      }
    });

    const total = monthBookings.length;
    const completionRate = total ? Math.round((attendedCount / total) * 100) : 0;
    const hoursStudied = (minutes / 60).toFixed(1);
    const topSubject = Object.entries(subjCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    // 7-day streak (days with attended class)
    const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(today.getDate() - 6);
    const days = new Set();
    normalized.forEach((n) => {
      if (attended(n.raw) && n.start >= sevenDaysAgo && n.start <= today) {
        const key = `${n.start.getFullYear()}-${n.start.getMonth()}-${n.start.getDate()}`;
        days.add(key);
      }
    });
    const streak7 = days.size;

    return { completionRate, hoursStudied, upcoming, topSubject, total, streak7 };
  }, [monthBookings, normalized, today]);

  const AnimatedScroll = Animated.ScrollView;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Toast */}
      {toastVisible && (
        <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
          <Ionicons name="information-circle-outline" size={16} color="#fff" />
          <Text style={styles.toastText}>{toastText}</Text>
        </Animated.View>
      )}

      <View style={styles.container} pointerEvents="box-none">
        <AnimatedScroll
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          pointerEvents="box-none"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={
                  student?.profileImage
                    ? { uri: student.profileImage }
                    : require('../assets/images/avatar.png')
                }
                style={styles.avatar}
              />
              <View>
                <Text style={styles.headerHello}>Welcome</Text>
                <Text style={styles.headerName} numberOfLines={1}>
                  {student?.name || 'Student'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.notifyBtn}
              onPress={() =>
                navigation.navigate('NotificationScreen', { notifications })
              }
              activeOpacity={0.85}
            >
              <Ionicons name="notifications" size={22} color="#0A8F9E" />
              {notifications.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Hero / Welcome */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeDecorOne} />
            <View style={styles.welcomeDecorTwo} />
            <View style={styles.welcomeLeft}>
              <Text style={styles.greeting}>
                Hi, {student?.name || 'Student'}
              </Text>
              <Text style={styles.subGreeting}>Ready to learn today?</Text>

              <View style={styles.heroActions}>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => navigation.navigate('SearchTutors', { studentId })}
                >
                  <Ionicons name="search" size={16} color="#0A8F9E" />
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() =>
                    navigation.navigate('StudentChatList', { studentId })
                  }
                  accessibilityLabel="Open Chat"
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color="#0A8F9E"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View
              style={[
                styles.welcomeRight,
                { transform: [{ translateY: heroTranslateY }, { scale: heroScale }] },
              ]}
            >
              <Image
                source={require('../assets/images/welcomeGirl.png')}
                style={styles.welcomeImage}
              />
            </Animated.View>
          </View>

          {/* Quick Nav */}
          <View style={styles.navGridContainer}>
            <TouchableOpacity
              style={styles.navGridBox}
              onPress={() => navigation.navigate('SearchTutors', { studentId })}
            >
              <Image
                source={require('../assets/images/searching.png')}
                style={styles.navIcon}
              />
              <Text style={styles.navGridText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navGridBox}
              onPress={() =>
                navigation.navigate('BookingRequestsStudent', { studentId })
              }
            >
              <Image
                source={require('../assets/images/schedule.png')}
                style={styles.navIcon}
              />
              <Text style={styles.navGridText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navGridBox}
              onPress={() => navigation.navigate('StudentProgress', { studentId })}
            >
              <Image
                source={require('../assets/images/progresses.png')}
                style={styles.navIcon}
              />
              <Text style={styles.navGridText}>Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navGridBox}
              onPress={() => navigation.navigate('StudentSettings', { studentId })}
            >
              <Image
                source={require('../assets/images/settings.png')}
                style={styles.navIcon}
              />
              <Text style={styles.navGridText}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* ===== NEW: Progress Snapshot card (above Recommended Tutors) ===== */}
          <Text style={styles.sectionTitle}>Your Month at a Glance</Text>

          {progressLoading ? (
            <ProgressCardSkeleton />
          ) : (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progress Snapshot</Text>
                <View style={styles.progressRangePill}>
                  <Ionicons name="calendar-number-outline" size={12} color="#0A8F9E" />
                  <Text style={styles.progressRangeText}>This Month</Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                {/* Big % */}
                <View style={styles.percentBlock}>
                  <Text style={styles.percentValue}>{snapshot.completionRate}%</Text>
                  <Text style={styles.percentLabel}>Completion</Text>
                </View>

                {/* Bar + metrics */}
                <View style={{ flex: 1 }}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${snapshot.completionRate}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statPill}>
                      <Ionicons name="time-outline" size={14} color="#0A8F9E" />
                      <Text style={styles.statText}>{snapshot.hoursStudied}h</Text>
                    </View>

                    <View style={styles.statPill}>
                      <Ionicons name="calendar-outline" size={14} color="#0A8F9E" />
                      <Text style={styles.statText}>{snapshot.upcoming} upcoming</Text>
                    </View>

                    <View style={styles.statPill}>
                      <Ionicons name="flame-outline" size={14} color="#0A8F9E" />
                      <Text style={styles.statText}>{snapshot.streak7}-day streak</Text>
                    </View>
                  </View>

                  <View style={styles.subRow}>
                    <View style={styles.subjectChip}>
                      <Ionicons name="book-outline" size={12} color="#0A8F9E" />
                      <Text style={styles.subjectChipText}>Top: {snapshot.topSubject}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.progressCTA}
                      onPress={() => navigation.navigate('StudentProgress', { studentId })}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.progressCTAText}>View full </Text>
                      <Ionicons name="chevron-forward" size={14} color="#0A8F9E" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Recommended Tutors */}
          <Text style={styles.sectionTitle}>Recommended Tutors</Text>
          {loading ? (
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <TutorCardSkeleton />
              <TutorCardSkeleton />
              <TutorCardSkeleton />
            </View>
          ) : tutors.length === 0 ? (
            <Text style={styles.emptyText}>No recommended tutors found.</Text>
          ) : (
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              style={{ marginBottom: 16 }}
            >
              {tutors.map((tutor, index) => {
                const { lat, lng } = getBestCoords(tutor);
                const distance =
                  lat && lng && studentLocation
                    ? calculateDistance(
                        studentLocation.latitude,
                        studentLocation.longitude,
                        lat,
                        lng
                      ).toFixed(1)
                    : null;

                const imgSrc = tutor.profileImage
                  ? { uri: `http://172.20.10.3:5000/${tutor.profileImage}` }
                  : require('../assets/images/avatar.png');

                return (
                  <View key={index} style={styles.tutorCardPro}>
                    <View style={styles.tutorDecorDot} />
                    <Image source={imgSrc} style={styles.tutorAvatarPro} />

                    <View style={styles.ratingPill}>
                      <Ionicons name="star" size={12} color="#FFD166" />
                      {tutor.rating?.count > 0 ? (
                        <Text style={styles.ratingPillText}>
                          {tutor.rating.value.toFixed(1)}
                        </Text>
                      ) : (
                        <Text style={styles.ratingPillText}>—</Text>
                      )}
                    </View>

                    <Text style={styles.tutorNamePro} numberOfLines={1}>
                      {tutor.name}
                    </Text>
                    <View style={styles.tagRow}>
                      <View style={styles.tag}>
                        <Ionicons name="book-outline" size={12} color="#0A8F9E" />
                        <Text style={styles.tagText}>
                          {tutor.subjects?.[0] || 'Subject'}
                        </Text>
                      </View>

                      {distance && (
                        <View style={styles.tagMuted}>
                          <Ionicons name="navigate" size={12} color="#7A8A96" />
                          <Text style={styles.tagMutedText}>{distance} km</Text>
                        </View>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.tutorCTAPro}
                      onPress={() =>
                        navigation.navigate('TutorDetails', {
                          tutorId: tutor._id,
                          subject: tutor.subjects?.[0] || 'N/A',
                          studentId,
                        })
                      }
                      activeOpacity={0.9}
                    >
                      <Ionicons name="eye-outline" size={14} color="#fff" />
                      <Text style={styles.tutorCTATextPro}>View Profile</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </Animated.ScrollView>
          )}

          {/* Upcoming Classes */}
          {upcomingBookings.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Upcoming Classes</Text>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hList}
                style={{ marginBottom: 6 }}
              >
                {upcomingBookings
                  .filter((b) => b.classId && b.tutorId)
                  .map((booking, index) => (
                    <View key={index} style={styles.classCardPro}>
                      <View style={styles.classTopRow}>
                        <Image
                          source={require('../assets/images/avatar.png')}
                          style={styles.classAvatar}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.classTutor} numberOfLines={1}>
                            {booking.tutorId?.name || 'Tutor'}
                          </Text>
                          <Text style={styles.classSubject} numberOfLines={1}>
                            {booking.classId?.subject || 'Subject'}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusChip,
                            booking.status === 'Accepted'
                              ? styles.statusAccepted
                              : booking.status === 'Pending'
                              ? styles.statusPending
                              : styles.statusOther,
                          ]}
                        >
                          <Text style={styles.statusChipText}>
                            {booking.status || 'Accepted'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.classRow}>
                        <Ionicons name="calendar" size={12} color="#7A8A96" />
                        <Text style={styles.classMeta}>
                          {booking.classId?.date || 'Date'} • {booking.classId?.startTime || 'Time'}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.classCTAPro}
                        onPress={() =>
                          navigation.navigate('BookingDetailsStudent', {
                            bookingId: booking._id,
                            tutorId: booking.tutorId?._id,
                            tutorName: booking.tutorId?.name,
                            subject: booking.classId?.subject,
                            date: booking.classId?.date,
                            startTime: booking.classId?.startTime,
                            fee: booking.classId?.fee,
                            latitude: booking.classId?.latitude || 7.8731,
                            longitude: booking.classId?.longitude || 80.7718,
                            status: booking.status,
                            attendanceStatus: booking.attendanceStatus,
                            studentId,
                          })
                        }
                        activeOpacity={0.9}
                      >
                        <Text style={styles.classCTATextPro}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </Animated.ScrollView>
            </>
          ) : loading ? (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <ClassCardSkeleton />
              <ClassCardSkeleton />
            </View>
          ) : null}
        </AnimatedScroll>
      </View>
    </SafeAreaView>
  );
}
