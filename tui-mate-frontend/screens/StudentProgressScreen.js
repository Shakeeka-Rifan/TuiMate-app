import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/StudentProgressStyles';

export default function StudentProgressScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState('month'); // 'week' | 'month' | 'all'

  // ---- Constants & helpers ----
  const today = new Date(); // <-- was missing

  const startOfWeek = (d) => {
    const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = (copy.getDay() + 6) % 7; // Monday = 0
    copy.setDate(copy.getDate() - day);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  const endOfWeek = (d) => {
    const s = startOfWeek(d);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  };

  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  const isWithin = (date, a, b) => date >= a && date <= b;

  const minutesBetween = (start, end) =>
    Math.max(0, Math.round((end - start) / 60000)); // <-- was missing

  const isAccepted = (b) => String(b?.status || '').toLowerCase() === 'accepted'; // <-- was missing
  const isCancelled = (b) =>
    ['cancelled', 'declined'].includes(String(b?.status || '').toLowerCase()); // <-- was missing

  // Robust date parser
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date(0);

    // 1) Try native (handles ISO)
    let d = new Date(dateStr);
    if (isNaN(d)) {
      // 2) Try split on - or /
      const parts = String(dateStr).split(/[-/]/);
      if (parts.length >= 3) {
        let y, m, day;
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          y = +parts[0];
          m = +parts[1];
          day = parseInt(parts[2], 10);
        } else {
          // DD-MM-YYYY (or DD/MM/YYYY)
          day = +parts[0];
          m = +parts[1];
          y = parseInt(parts[2], 10);
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

  // Treat completed as either booking.status === 'Completed' OR attendance present/attended
  const attended = (b) => {
    const s = String(b?.status || '').toLowerCase();               // accepted/completed/…
    const a = String(b?.attendanceStatus || '').toLowerCase();     // present/attended/…
    return (
      s === 'completed' ||
      a === 'present' ||
      a === 'attended' ||
      a === 'completed'
    );
  };

  // ---- Fetch ----
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://172.20.10.3:5000/api/bookings/student/${studentId}/bookings`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Student progress fetch failed:', e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [studentId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // ---- Derived by range ----
  const rangeBounds = useMemo(() => {
    if (range === 'week') return { from: startOfWeek(today), to: endOfWeek(today) };
    if (range === 'month') return { from: startOfMonth(today), to: endOfMonth(today) };
    return { from: new Date(0), to: new Date(8640000000000000) }; // all time
  }, [range, today]); // include today so a re-render in a new day respects new ranges

  // Normalize bookings to have handy fields
  const normalized = useMemo(() => {
    return bookings.map((b) => {
      const cls = b?.classId || {};
      const start = parseDateTime(cls.date, cls.startTime);
      const end = parseDateTime(cls.date, cls.endTime || cls.startTime);
      const subject = cls.subject || 'Class';
      const grade = cls.grade || '—';
      return { raw: b, start, end, subject, grade };
    });
  }, [bookings]);

  const inRange = useMemo(
    () => normalized.filter((n) => isWithin(n.start, rangeBounds.from, rangeBounds.to)),
    [normalized, rangeBounds]
  );

  // KPIs
  const kpis = useMemo(() => {
    let attendedCount = 0;
    let upcomingCount = 0;
    let cancelledCount = 0;
    let minutes = 0;

    inRange.forEach((n) => {
      const b = n.raw;
      if (attended(b)) {
        attendedCount++;
        minutes += minutesBetween(n.start, n.end);
      } else if (isCancelled(b)) {
        cancelledCount++;
      } else {
        // pending or accepted → treat future accepted as upcoming
        if (isAccepted(b) && n.start >= today) upcomingCount++;
      }
    });

    const total = inRange.length;
    const completionRate = total ? Math.round((attendedCount / total) * 100) : 0;

    return {
      totalSessions: total,
      attended: attendedCount,
      upcoming: upcomingCount,
      cancelled: cancelledCount,
      hoursStudied: (minutes / 60).toFixed(1),
      completionRate,
    };
  }, [inRange, today]);

  const topSubjects = useMemo(() => {
    const counts = {};
    inRange.forEach((n) => (counts[n.subject] = (counts[n.subject] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [inRange]);

  const upcomingToday = useMemo(() => {
    return normalized
      .filter((n) => {
        const b = n.raw;
        const sameDay =
          n.start.getFullYear() === today.getFullYear() &&
          n.start.getMonth() === today.getMonth() &&
          n.start.getDate() === today.getDate();
        return sameDay && isAccepted(b) && n.start >= today;
      })
      .sort((a, b) => a.start - b.start)
      .slice(0, 5);
  }, [normalized, today]);

  const overdue = useMemo(() => {
    return normalized
      .filter((n) => {
        const b = n.raw;
        if (attended(b) || isCancelled(b)) return false;
        return n.end < today; // ended but not attended/marked
      })
      .sort((a, b) => a.end - b.end)
      .slice(0, 5);
  }, [normalized, today]);

  const pct = (num, den) => {
    if (!den) return '0%';
    const p = Math.round((num / den) * 100);
    return `${p}%`;
  };

  // ---- UI ----
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Progress</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollArea}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {/* Range chips */}
        <View style={styles.rangeRow}>
          {[
            { key: 'week', label: 'This Week', icon: 'calendar-outline' },
            { key: 'month', label: 'This Month', icon: 'calendar-number-outline' },
            { key: 'all', label: 'All Time', icon: 'infinite-outline' },
          ].map((r) => {
            const active = range === r.key;
            return (
              <TouchableOpacity
                key={r.key}
                style={[styles.rangeChip, active && styles.rangeChipActive]}
                onPress={() => setRange(r.key)}
                activeOpacity={0.85}
              >
                <Ionicons name={r.icon} size={14} color={active ? '#fff' : '#0B3E45'} />
                <Text style={[styles.rangeChipText, active && styles.rangeChipTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* KPIs */}
        {loading ? (
          <ActivityIndicator size="large" color="#088F9E" style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="book-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>{kpis.totalSessions}</Text>
              <Text style={styles.kpiLabel}>Sessions</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="checkmark-done-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>{kpis.completionRate}%</Text>
              <Text style={styles.kpiLabel}>Completion</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="time-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>{kpis.hoursStudied}</Text>
              <Text style={styles.kpiLabel}>Hours Studied</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="calendar-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>{kpis.upcoming}</Text>
              <Text style={styles.kpiLabel}>Upcoming</Text>
            </View>
          </View>
        )}

        {/* Status bars */}
        {!loading && (
          <View style={styles.block}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTitle}>Status Overview</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Attended</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    styles.barFillCompleted,
                    { width: pct(kpis.attended, Math.max(1, inRange.length)) },
                  ]}
                />
              </View>
              <Text style={styles.barCount}>{kpis.attended}</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Upcoming</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    styles.barFillPending,
                    { width: pct(kpis.upcoming, Math.max(1, inRange.length)) },
                  ]}
                />
              </View>
              <Text style={styles.barCount}>{kpis.upcoming}</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Cancelled</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    styles.barFillCancelled,
                    { width: pct(kpis.cancelled, Math.max(1, inRange.length)) },
                  ]}
                />
              </View>
              <Text style={styles.barCount}>{kpis.cancelled}</Text>
            </View>
          </View>
        )}

        {/* Top subjects */}
        {!loading && (
          <View style={styles.block}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTitle}>Top Subjects</Text>
            </View>
            {topSubjects.length === 0 ? (
              <Text style={styles.emptyMini}>No data in this range.</Text>
            ) : (
              <View style={styles.pillWrap}>
                {topSubjects.map(([s, c]) => (
                  <View key={s} style={styles.pill}>
                    <Ionicons name="ribbon-outline" size={14} color="#088F9E" />
                    <Text style={styles.pillText}>
                      {s} · {c}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Upcoming today */}
        {!loading && (
          <View style={styles.block}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTitle}>Upcoming Today</Text>
            </View>

            {upcomingToday.length === 0 ? (
              <Text style={styles.emptyMini}>No upcoming sessions today.</Text>
            ) : (
              upcomingToday.map((n) => {
                const b = n.raw;
                return (
                  <TouchableOpacity
                    key={b._id}
                    style={styles.itemCard}
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('BookingDetailsStudent', {
                        bookingId: b._id,
                        tutorId: b?.tutorId?._id,
                        tutorName: b?.tutorId?.name,
                        subject: n.subject,
                        date: b?.classId?.date,
                        startTime: b?.classId?.startTime,
                        fee: b?.classId?.fee,
                        latitude: b?.classId?.latitude || 7.8731,
                        longitude: b?.classId?.longitude || 80.7718,
                        status: b?.status,
                        attendanceStatus: b?.attendanceStatus,
                        studentId,
                      })
                    }
                  >
                    <Image
                      source={require('../assets/images/class-placeholder.png')}
                      style={styles.itemThumb}
                    />
                    <View style={styles.itemBody}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {n.subject}
                      </Text>
                      <View style={styles.itemRow}>
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        <Text style={styles.itemMeta}>
                          {b?.classId?.date} · {b?.classId?.startTime}
                        </Text>
                      </View>
                      <View style={styles.itemRow}>
                        <Ionicons name="school-outline" size={14} color="#64748b" />
                        <Text style={styles.itemMeta}>Grade {n.grade}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {/* Overdue to attend/mark */}
        {!loading && (
          <View style={styles.block}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTitle}>Missed or Awaiting Marking</Text>
            </View>

            {overdue.length === 0 ? (
              <Text style={styles.emptyMini}>Nothing here—nice!</Text>
            ) : (
              overdue.map((n) => (
                <View key={n.raw._id} style={styles.itemCardSoft}>
                  <View style={styles.dot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitleSoft} numberOfLines={1}>
                      {n.subject}
                    </Text>
                    <Text style={styles.itemMetaSoft}>
                      {n.raw?.classId?.date} · {n.raw?.classId?.endTime || n.raw?.classId?.startTime}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Shortcuts */}
        <View style={styles.shortcutRow}>
          <TouchableOpacity
            style={[styles.shortcutBtn, styles.shortcutPrimary]}
            onPress={() => navigation.navigate('BookingRequestsStudent', { studentId })}
            activeOpacity={0.9}
          >
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.shortcutTextPrimary}>My Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutBtn, styles.shortcutGhost]}
            onPress={() => navigation.navigate('SearchTutors', { studentId })}
            activeOpacity={0.9}
          >
            <Ionicons name="search-outline" size={16} color="#088F9E" />
            <Text style={styles.shortcutTextGhost}>Find Tutors</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
