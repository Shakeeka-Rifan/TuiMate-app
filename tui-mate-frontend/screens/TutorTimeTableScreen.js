import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/TutorTimeTableStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pick the right badge style based on status text
const badgeStyleFor = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed') return [styles.badge, styles.badgeCompleted];
  if (s === 'cancelled') return [styles.badge, styles.badgeCancelled];
  if (s === 'pending' || !s) return [styles.badge, styles.badgePending];
  return [styles.badge, styles.badgeDefault];
};


export default function TutorTimeTableScreen({ navigation }) {
  const [tutorId, setTutorId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateLocked, setDateLocked] = useState(false); // ← lock filtering to a day after pick
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [filterStatus, setFilterStatus] = useState('All'); // All, Completed, Pending, Cancelled

  // ---- helpers ----
  const formatYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;

  const isSameYMD = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const toDateTime = (dateStr, timeStr) => {
    const [y, m, d] = String(dateStr || '').split('-').map(Number);
    const [hh, mm] = String(timeStr || '00:00').split(':').map(Number);
    return new Date(y || 1970, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  };

  const sortByDateTimeAsc = (arr) =>
    [...arr].sort((a, b) => {
      const ta = toDateTime(a.date, a.startTime).getTime();
      const tb = toDateTime(b.date, b.startTime).getTime();
      return ta - tb;
    });

  // ---- data flow ----
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('tutorId');
      setTutorId(id);
    })();
  }, []);

  useEffect(() => {
    if (!tutorId) return;
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId, selectedDate, filterStatus, dateLocked]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      // Only pass date to API when date is locked (user explicitly picked a day)
      if (dateLocked) query.append('date', formatYMD(selectedDate));

      // For Pending we want to include items with missing status, so don't pass status to API;
      // we'll refine client-side. For other statuses, pass to API.
      const passStatusToApi = filterStatus !== 'All' && filterStatus !== 'Pending';
      if (passStatusToApi) query.append('status', filterStatus);

      const res = await fetch(
        `http://172.20.10.3:5000/api/classes/tutor/${tutorId}?${query.toString()}`
      );
      const data = await res.json();
      let list = Array.isArray(data) ? data : [];

      // Client-side refinement
      const now = new Date();

      // If date is NOT locked and status != Pending, we show everything for that status (or all),
      // so no extra date filtering here.

      // If date IS locked, ensure we only show that day (server already filtered, but be safe).
      if (dateLocked) {
        const ymd = formatYMD(selectedDate);
        list = list.filter((c) => c.date === ymd);
      }

      if (filterStatus === 'Pending') {
        // Keep only not-done: status pending OR undefined/null/empty, and not cancelled/completed
        list = list.filter((c) => {
          const s = String(c?.status || 'Pending').toLowerCase();
          return s !== 'cancelled' && s !== 'completed';
        });

        // Upcoming rule:
        // - If date is locked:
        //    * for TODAY: start time must be >= now
        //    * for FUTURE day: all are upcoming
        //    * for PAST day: none (they’re already done)
        // - If date not locked: show upcoming from now across all dates
        if (dateLocked) {
          const isToday = isSameYMD(selectedDate, now);
          const isFuture = toDateTime(formatYMD(selectedDate), '00:00') > toDateTime(formatYMD(now), '23:59');
          if (isToday) {
            list = list.filter((c) => toDateTime(c.date, c.startTime) >= now);
          } else if (!isFuture) {
            // past date
            list = [];
          }
        } else {
          // Not locked → upcoming across all days
          list = list.filter((c) => toDateTime(c.date, c.startTime) >= now);
        }
      }

      setClasses(sortByDateTimeAsc(list));
    } catch (e) {
      console.error('Error fetching classes:', e);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = formatYMD(selectedDate);

  // ---- UI ----
  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('TutorDashboard', { tutorId })}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Time Table</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} keyboardShouldPersistTaps="handled">
        {/* Toolbar: date + clear */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.datePill, dateLocked && styles.datePillActive]}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar-outline" size={18} color={dateLocked ? '#fff' : '#088F9E'} />
            <Text style={[styles.datePillText, dateLocked && styles.datePillTextActive]}>
              {formattedDate}
            </Text>
          </TouchableOpacity>

          {dateLocked && (
            <TouchableOpacity
              onPress={() => {
                setDateLocked(false);
                // we keep selectedDate value for convenience, but unlock filtering
              }}
              style={styles.clearDateBtn}
              activeOpacity={0.85}
            >
              <Ionicons name="close-circle" size={16} color="#0b3e45" />
              <Text style={styles.clearDateText}>Clear date</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Calendar modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Choose a date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.pickerCloseBtn}>
                  <Ionicons name="close" size={20} color="#0b3e45" />
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onChange={(event, date) => {
                  if (Platform.OS === 'android') {
                    if (event.type === 'set' && date) {
                      setSelectedDate(date);
                      setDateLocked(true); // ← lock when user picks
                    }
                    setShowDatePicker(false);
                  } else {
                    if (date) setSelectedDate(date);
                  }
                }}
                style={styles.pickerControl}
              />

              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtons}>
                  <TouchableOpacity
                    style={[styles.pickerBtn, styles.pickerCancel]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.pickerBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pickerBtn}
                    onPress={() => {
                      setDateLocked(true); // lock on done
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={styles.pickerBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Filter chips */}
        <View style={styles.filtersRow}>
          {['All', 'Completed', 'Pending', 'Cancelled'].map((status) => {
            const active = filterStatus === status;
            return (
              <TouchableOpacity
                key={status}
                onPress={() => setFilterStatus(status)}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={
                    status === 'All'
                      ? 'layers-outline'
                      : status === 'Completed'
                      ? 'checkmark-done-outline'
                      : status === 'Pending'
                      ? 'hourglass-outline'
                      : 'close-circle-outline'
                  }
                  size={14}
                  color={active ? '#fff' : '#0b3e45'}
                />
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" color="#088F9E" style={{ marginTop: 24 }} />
        ) : classes.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="calendar-clear-outline" size={34} color="#088F9E" />
            </View>
            <Text style={styles.emptyTitle}>No classes found</Text>
            <Text style={styles.emptySub}>
              {dateLocked ? 'Try a different date or filter.' : 'Try a different filter.'}
            </Text>
          </View>
        ) : (
          classes.map((cls) => (
            <TouchableOpacity
              key={cls._id}
              style={styles.classCard}
              onPress={() =>
                navigation.navigate('ClassDetails', {
                  classId: cls._id,
                  subject: cls.subject,
                  grade: cls.grade,
                  batchSize: cls.batchSize,
                  date: cls.date,
                  startTime: cls.startTime,
                  fee: cls.fee,
                  tutorId: tutorId,
                })
              }
              activeOpacity={0.9}
            >
              {/* status badge (if available) */}
              {cls.status ? (
                <View style={[...badgeStyleFor(cls.status), styles.badgePos]}>
                  <Text style={styles.badgeText}>{cls.status}</Text>
                </View>
              ) : null}

              {/* image */}
              <View style={styles.thumbWrap}>
                <Image
                  source={require('../assets/images/class-placeholder.png')}
                  style={styles.classImage}
                />
              </View>

              {/* info */}
              <View style={styles.classInfo}>
                <Text style={styles.classSubject} numberOfLines={1}>
                  {cls.subject}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.chip}>
                    <Ionicons name="calendar-outline" size={14} color="#0b3e45" />
                    <Text style={styles.chipText}>{cls.date}</Text>
                  </View>
                  <View style={styles.chip}>
                    <Ionicons name="time-outline" size={14} color="#0b3e45" />
                    <Text style={styles.chipText}>{cls.startTime}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.chipSoft}>
                    <Ionicons name="school-outline" size={14} color="#088F9E" />
                    <Text style={styles.chipSoftText}>Grade {cls.grade}</Text>
                  </View>
                  <View style={styles.chipSoft}>
                    <Ionicons name="people-outline" size={14} color="#088F9E" />
                    <Text style={styles.chipSoftText}>{cls.batchSize} students</Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#94a3b8" style={styles.chevronIcon} />
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
