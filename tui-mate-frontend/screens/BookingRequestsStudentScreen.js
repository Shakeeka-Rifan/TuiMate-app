// ✅ BookingRequestsStudentScreen.js (updated with modern calendar + dropdown + pastel UI)

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles/BookingRequestsStudentStyles';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookingRequestsStudentScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://172.20.10.3:5000/api/bookings/student/${studentId}/bookings`);
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => new Date(year, month, i + 1));
  };

  const weekDates = getDaysInMonth(currentMonth);

  const filteredBookings = bookings.filter((booking) => {
    const classDateStr = booking.classId?.date;
    if (!classDateStr || isNaN(Date.parse(classDateStr))) return false;

    const bookingDate = new Date(classDateStr);
    const selectedDateOnly = selectedDate?.toISOString().split('T')[0];
    const bookingDateOnly = bookingDate.toISOString().split('T')[0];

    const matchDate = selectedDate ? selectedDateOnly === bookingDateOnly : true;

    const matchStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'NotAttended'
        ? booking.attendanceStatus === 'NotAttended'
        : booking.status === filterStatus;

    return matchDate && matchStatus;
  });

  const handleViewDetails = (booking) => {
    navigation.navigate('BookingDetailsStudent', {
      bookingId: booking._id,
      tutorId: booking.tutorId?._id,
      tutorName: booking.tutorId?.name || 'Tutor Name',
      subject: booking.classId?.subject,
      date: booking.classId?.date,
      startTime: booking.classId?.startTime,
      fee: booking.classId?.fee,
      latitude: booking.classId?.latitude || 7.8731,
      longitude: booking.classId?.longitude || 80.7718,
      status: booking.status,
      attendanceStatus: booking.attendanceStatus,
      studentId,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('StudentDashboard', { studentId })}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.headerBooking}>My Bookings</Text>

      {/* 📅 Calendar UI */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Ionicons name="chevron-back" size={22} color="#888" />
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Ionicons name="chevron-forward" size={22} color="#888" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
          contentContainerStyle={styles.dateScrollContent}
        >
          {weekDates.map((date, i) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <TouchableOpacity
                key={i}
                style={[styles.datePill, isSelected && styles.datePillSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.datePillDay, isSelected && styles.datePillDaySelected]}>
                  {date.getDate()}
                </Text>
                <Text style={[styles.datePillWeekday, isSelected && styles.datePillWeekdaySelected]}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                {isSelected && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

       {/* 🧼 Clear Date */}
{selectedDate && (
  <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearDateBtn}>
    <Text style={styles.clearDateText}>Clear Date Filter</Text>
  </TouchableOpacity>
)}
      </View>

      {/* 🎯 Filter Dropdown */}
      <View style={styles.filterSection}>
  <Text style={styles.filterLabelTitle}>📋 Filter by Booking Status</Text>

  <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.filterButton}>
    <MaterialIcons name="filter-list" size={20} color="#1f8c8aff" />
    <Text style={styles.filterButtonText}>
      {filterStatus === 'NotAttended' ? 'Not Attended' : filterStatus}
    </Text>
    <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#1f8c8aff" />
  </TouchableOpacity>

  {showDropdown && (
    <View style={styles.dropdownCard}>
      {['All', 'Completed', 'Pending', 'NotAttended'].map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.dropdownItemCard,
            filterStatus === status && styles.dropdownItemActive,
          ]}
          onPress={() => {
            setFilterStatus(status);
            setShowDropdown(false);
          }}
        >
          <Text
            style={[
              styles.dropdownItemText,
              filterStatus === status && styles.dropdownItemTextActive,
            ]}
          >
            {status === 'NotAttended' ? 'Not Attended' : status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
  {/* 🔍 Enhanced Filter Label */}
<View style={styles.filterLabelWrapper}>
  <Text style={styles.filterLabelText}>
    🔍 Showing: <Text style={styles.highlightStatus}>
      {filterStatus === 'NotAttended' ? 'Not Attended' : filterStatus}
    </Text>
    {selectedDate && (
      <Text style={styles.highlightDate}> on {selectedDate.toDateString()}</Text>
    )}
  </Text>
</View>
</View>



      

      {/* 📄 Booking Cards */}
      {loading ? (
        <ActivityIndicator size="large" color="#63ffe8ff" style={{ marginTop: 20 }} />
      ) : filteredBookings.length === 0 ? (
        <Text style={styles.noRequests}>No bookings found</Text>
      ) : (
        filteredBookings.map((booking) => (
          <View key={booking._id} style={styles.requestCard}>
            <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{booking.tutorId?.name}</Text>
              <Text style={styles.details}>Date: {booking.classId?.date}</Text>
              <Text style={styles.details}>Time: {booking.classId?.startTime}</Text>
              <Text style={styles.details}>Grade: {booking.classId?.grade}</Text>
              <View style={styles.badgeWrapper}>
  <Text style={[styles.badge, { backgroundColor: '#A5D6A7' }]}>
    Status: {booking.status}
  </Text>
  <Text style={[styles.badge, { backgroundColor: '#C8E6C9' }]}>
    Attendance: {booking.attendanceStatus || 'Upcoming'}
  </Text>
</View>

            </View>

            {booking.status === 'Accepted' ? (
              <TouchableOpacity style={styles.detailsButton} onPress={() => handleViewDetails(booking)}>
                <Text style={styles.viewMapButtonText}>View details</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.detailsButton, { backgroundColor: '#ccc' }]}>
                <Text style={[styles.viewMapButtonText, { color: '#666' }]}>Awaiting </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
