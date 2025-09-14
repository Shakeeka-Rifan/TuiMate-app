import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/TutorProgressStyles';

export default function TutorProgressScreen({ navigation }) {
  const [tutorId, setTutorId] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState('month'); // 'week' | 'month' | 'all'

  // --- Helpers ---
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date(0);
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh = 0, mm = 0] = String(timeStr || '00:00').split(':').map(Number);
    return new Date(y, (m || 1) - 1, d, hh, mm, 0, 0);
  };
  const minutesBetween = (start, end) => Math.max(0, Math.round((end - start) / 60000));
  const statusOf = (cls) => (cls?.status ? String(cls.status).toLowerCase() : 'pending');
  const isCompleted = (s) => s === 'completed';
  const isCancelled = (s) => s === 'cancelled';
  const isPending = (s) => s === 'pending' || (!s && s !== 'completed' && s !== 'cancelled');

  const startOfWeek = (d) => {
    const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = (copy.getDay() + 6) % 7; // Monday=0
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

  // --- Fetch ---
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const id = await AsyncStorage.getItem('tutorId');
      setTutorId(id);
      const res = await fetch(`http://172.20.10.3:5000/api/classes/tutor/${id}`);
      const data = await res.json();
      setAllClasses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Progress fetch failed:', e);
      setAllClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // --- Derived (based on range) ---
  const today = new Date();
  const rangeBounds = useMemo(() => {
    if (range === 'week') return { from: startOfWeek(today), to: endOfWeek(today) };
    if (range === 'month') return { from: startOfMonth(today), to: endOfMonth(today) };
    return { from: new Date(0), to: new Date(8640000000000000) }; // all time
  }, [range]);

  const inRangeClasses = useMemo(() => {
    return allClasses.filter((c) => {
      const when = parseDateTime(c.date, c.startTime);
      return isWithin(when, rangeBounds.from, rangeBounds.to);
    });
  }, [allClasses, rangeBounds]);

  const kpis = useMemo(() => {
    const list = inRangeClasses;
    let completed = 0, pending = 0, cancelled = 0;
    let minutesTaught = 0;
    let earnings = 0;

    list.forEach((c) => {
      const s = statusOf(c);
      if (isCompleted(s)) {
        completed++;
        const start = parseDateTime(c.date, c.startTime);
        const end = parseDateTime(c.date, c.endTime);
        minutesTaught += minutesBetween(start, end);
        earnings += Number(c.fee || 0);
      } else if (isCancelled(s)) {
        cancelled++;
      } else {
        pending++;
      }
    });

    const totalForRate = completed + pending + cancelled;
    const completionRate = totalForRate ? Math.round((completed / totalForRate) * 100) : 0;

    return {
      totalClasses: inRangeClasses.length,
      completionRate,
      hoursTaught: (minutesTaught / 60).toFixed(1),
      earnings,
      counts: { completed, pending, cancelled },
    };
  }, [inRangeClasses]);

  const topSubjects = useMemo(() => {
    const counts = {};
    inRangeClasses.forEach((c) => {
      const key = c.subject || '—';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5
  }, [inRangeClasses]);

  const upcomingToday = useMemo(() => {
    return allClasses
      .filter((c) => {
        const s = statusOf(c);
        if (!isPending(s)) return false;
        const when = parseDateTime(c.date, c.startTime);
        const sameDay =
          when.getFullYear() === today.getFullYear() &&
          when.getMonth() === today.getMonth() &&
          when.getDate() === today.getDate();
        return sameDay && when >= today;
      })
      .sort((a, b) => parseDateTime(a.date, a.startTime) - parseDateTime(b.date, b.startTime))
      .slice(0, 5);
  }, [allClasses]);

  const overdue = useMemo(() => {
    return allClasses
      .filter((c) => {
        const s = statusOf(c);
        if (isCompleted(s) || isCancelled(s)) return false;
        const ends = parseDateTime(c.date, c.endTime || c.startTime || '00:00');
        return ends < today;
      })
      .sort((a, b) => parseDateTime(a.date, a.endTime || a.startTime) - parseDateTime(b.date, b.endTime || b.startTime))
      .slice(0, 5);
  }, [allClasses]);

  const pct = (num, den) => {
    if (!den) return '0%';
    const p = Math.round((num / den) * 100);
    return `${p}%`;
  };

  // --- UI ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('TutorDashboard', { tutorId })}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teaching Progress</Text>
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
                <Ionicons
                  name={r.icon}
                  size={14}
                  color={active ? '#fff' : '#0B3E45'}
                />
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
            <View style={[styles.kpiCard, styles.kpiA]}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="book-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>{kpis.totalClasses}</Text>
              <Text style={styles.kpiLabel}>Classes</Text>
            </View>

            <View style={[styles.kpiCard, styles.kpiB]}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="checkmark-done-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>{kpis.completionRate}%</Text>
              <Text style={styles.kpiLabel}>Completion</Text>
            </View>

            <View style={[styles.kpiCard, styles.kpiC]}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="time-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>{kpis.hoursTaught}</Text>
              <Text style={styles.kpiLabel}>Hours Taught</Text>
            </View>

            <View style={[styles.kpiCard, styles.kpiD]}>
              <View style={styles.kpiIconWrap}>
                <Ionicons name="cash-outline" size={16} color="#088F9E" />
              </View>
              <Text style={styles.kpiValue}>
                {Number(kpis.earnings || 0).toLocaleString()}
              </Text>
              <Text style={styles.kpiLabel}>Earnings</Text>
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
              <Text style={styles.barLabel}>Completed</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    styles.barFillCompleted,
                    { width: pct(kpis.counts.completed, Math.max(1, inRangeClasses.length)) },
                  ]}
                />
              </View>
              <Text style={styles.barCount}>{kpis.counts.completed}</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Pending</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    styles.barFillPending,
                    { width: pct(kpis.counts.pending, Math.max(1, inRangeClasses.length)) },
                  ]}
                />
              </View>
              <Text style={styles.barCount}>{kpis.counts.pending}</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Cancelled</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    styles.barFillCancelled,
                    { width: pct(kpis.counts.cancelled, Math.max(1, inRangeClasses.length)) },
                  ]}
                />
              </View>
              <Text style={styles.barCount}>{kpis.counts.cancelled}</Text>
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
                {topSubjects.map(([subj, count]) => (
                  <View key={subj} style={styles.pill}>
                    <Ionicons name="ribbon-outline" size={14} color="#088F9E" />
                    <Text style={styles.pillText}>
                      {subj} · {count}
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
              <Text style={styles.emptyMini}>No upcoming classes today.</Text>
            ) : (
              upcomingToday.map((c) => (
                <TouchableOpacity
                  key={c._id}
                  style={styles.itemCard}
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('ClassDetails', {
                      classId: c._id,
                      subject: c.subject,
                      grade: c.grade,
                      batchSize: c.batchSize,
                      date: c.date,
                      startTime: c.startTime,
                      fee: c.fee,
                      tutorId: tutorId,
                    })
                  }
                >
                  <View style={styles.itemLeft}>
                    <Image
                      source={require('../assets/images/class-placeholder.png')}
                      style={styles.itemThumb}
                    />
                  </View>
                  <View style={styles.itemBody}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{c.subject || 'Class'}</Text>
                    <View style={styles.itemRow}>
                      <Ionicons name="time-outline" size={14} color="#64748b" />
                      <Text style={styles.itemMeta}>{c.startTime}</Text>
                    </View>
                    <View style={styles.itemRow}>
                      <Ionicons name="school-outline" size={14} color="#64748b" />
                      <Text style={styles.itemMeta}>Grade {c.grade}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Overdue to mark */}
        {!loading && (
          <View style={styles.block}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTitle}>Overdue to Mark</Text>
            </View>

            {overdue.length === 0 ? (
              <Text style={styles.emptyMini}>Nothing to mark right now.</Text>
            ) : (
              overdue.map((c) => (
                <View key={c._id} style={styles.itemCardSoft}>
                  <View style={styles.dot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitleSoft} numberOfLines={1}>{c.subject || 'Class'}</Text>
                    <Text style={styles.itemMetaSoft}>
                      {c.date} · {c.endTime || c.startTime}
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
            onPress={() => navigation.navigate('TutorTimeTable', { tutorId })}
            activeOpacity={0.9}
          >
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.shortcutTextPrimary}>View Timetable</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutBtn, styles.shortcutGhost]}
            onPress={() => navigation.navigate('TutorClassCreation')}
            activeOpacity={0.9}
          >
            <Ionicons name="add-circle-outline" size={16} color="#088F9E" />
            <Text style={styles.shortcutTextGhost}>Create Class</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
