// screens/TutorClassCreationScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import styles from '../styles/TutorClassCreationStyles';

export default function TutorClassCreationScreen({ route, navigation }) {
  // IDs & core state
  const [tutorId, setTutorId] = useState(null);

  // address & coordinates
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // modal picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickedCoord, setPickedCoord] = useState(null);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pickerResults, setPickerResults] = useState([]);
  const mapRef = useRef(null);

  // device coord to bias OpenCage results
  const [deviceCoord, setDeviceCoord] = useState(null);

  // class details
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subject, setSubject] = useState(null);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [grade, setGrade] = useState(null);
  const [classTypeOpen, setClassTypeOpen] = useState(false);
  const [classType, setClassType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [fee, setFee] = useState('');
  const [batchSize, setBatchSize] = useState('');

  const subjects = [
    { label: 'Maths', value: 'Maths' },
    { label: 'Science', value: 'Science' },
    { label: 'English', value: 'English' },
    { label: 'ICT', value: 'ICT' },
    { label: 'Sinhala', value: 'Sinhala' },
  ];
  const grades = Array.from({ length: 13 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
  const classTypes = [
    { label: 'Group', value: 'Group' },
    { label: 'Individual', value: 'Individual' },
  ];

  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;

  // 🔑 (unchanged) – keep your API key/logic as-is
  const OPENCAGE_API_KEY = '5d4a242605dc419d8f8a5207f41ae7cf';
  const MIN_CONFIDENCE = 6;

  // helpers (unchanged)
  const normalizeQuery = (q) => q.replace(/\bNo\.?\s*/i, '').trim();

  const prettyAddressFrom = (best) => {
    const c = best?.components || {};
    const parts = [
      c.house_number && c.road ? `${c.house_number} ${c.road}` : c.road || c.pedestrian || c.footway || c.path || c.neighbourhood,
      c.suburb || c.village || c.town || c.city || c.county,
      c.state,
      c.postcode,
      c.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  async function searchPlacesOpenCage(q) {
    if (!q || q.length < 3) return [];
    const candidates = [
      q,
      `${q}, Sri Lanka`,
      normalizeQuery(q),
      `${normalizeQuery(q)}, Sri Lanka`,
    ];

    for (const cand of candidates) {
      try {
        const params = new URLSearchParams({
          q: cand,
          key: OPENCAGE_API_KEY,
          limit: '5',
          no_annotations: '1',
          countrycode: 'lk',
          language: 'en',
          ...(deviceCoord ? { proximity: `${deviceCoord.lat},${deviceCoord.lng}` } : {}),
        }).toString();

        const url = `https://api.opencagedata.com/geocode/v1/json?${params}`;
        const { data } = await axios.get(url);
        if (Array.isArray(data?.results) && data.results.length) {
          return data.results;
        }
      } catch (e) {
        console.warn('OpenCage search error:', e?.response?.status, e?.response?.data || e.message);
      }
    }
    return [];
  }

  const validateAddress = async (query) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${OPENCAGE_API_KEY}&limit=1&no_annotations=1&countrycode=lk&language=en`;
      const res = await axios.get(url);
      const results = res.data?.results || [];
      if (results.length === 0) return { ok: false, reason: 'No results found' };
      const best = results[0];
      if (!best.geometry || best.confidence < MIN_CONFIDENCE) {
        return { ok: false, reason: 'Address too vague—please be more specific' };
      }
      return {
        ok: true,
        lat: best.geometry.lat,
        lng: best.geometry.lng,
        formatted: best.formatted,
      };
    } catch (e) {
      return { ok: false, reason: 'Geocoding failed. Check network/API key.' };
    }
  };

  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}&limit=1&no_annotations=1`;
      const res = await axios.get(url);
      const best = res.data?.results?.[0];
      if (!best) return;
      const nice = prettyAddressFrom(best) || best.formatted;
      setLocation(nice);
      setLocationInput(nice);
      setLatitude(lat);
      setLongitude(lon);
    } catch (error) {
      console.error('Reverse geocoding failed:', error?.response?.status || error.message);
    }
  };

  // effects (unchanged)
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('tutorId');
      setTutorId(id);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setDeviceCoord({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    if (locationInput.length > 2) {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        locationInput
      )}&key=${OPENCAGE_API_KEY}&limit=5&no_annotations=1&countrycode=lk&language=en`;
      axios
        .get(url)
        .then((res) => setSuggestions(res.data?.results || []))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [locationInput]);

  // UI handlers (unchanged)
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (
      !tutorId ||
      !subject ||
      !date ||
      !startTime ||
      !endTime ||
      !fee ||
      !batchSize ||
      !grade ||
      !classType ||
      !(location || locationInput)
    ) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    let lat = typeof latitude === 'number' ? latitude : latitude ? Number(latitude) : null;
    let lng = typeof longitude === 'number' ? longitude : longitude ? Number(longitude) : null;
    let normalizedAddress = (location || locationInput || '').trim();
    if (!normalizedAddress) return Alert.alert('Error', 'Please enter a location');

    if (lat == null || lng == null) {
      const check = await validateAddress(normalizedAddress);
      if (!check.ok) return Alert.alert('Invalid Location', check.reason);
      lat = check.lat;
      lng = check.lng;
      normalizedAddress = check.formatted;
      setLatitude(lat);
      setLongitude(lng);
      setLocation(normalizedAddress);
      setLocationInput(normalizedAddress);
    }

    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return Alert.alert('Invalid Location', 'Coordinates are out of bounds.');
    }

    try {
      const response = await fetch('http://172.20.10.3:5000/api/classes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId,
          subject,
          date: formattedDate,
          startTime,
          endTime,
          fee,
          batchSize,
          grade,
          classType,
          location: normalizedAddress,
          latitude: lat,
          longitude: lng,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        Alert.alert('Success', 'Class created successfully');
        navigation.goBack();
      } else if (response.status === 409) {
        Alert.alert('Time Conflict', data.message || 'This time overlaps with an existing class.');
      } else if (response.status === 400) {
        Alert.alert('Invalid Data', data.message || 'Please check the location and details.');
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network Error', 'Could not connect to server');
    }
  };

  if (!tutorId) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Create Class</Text>
          <Text style={styles.subtitle}>Set subject, time, capacity & location</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Ionicons name="create-outline" size={22} color="#fff" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Card: Class Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Class details</Text>

          <Text style={styles.label}>Subject</Text>
          <View style={styles.z4000}>
            <DropDownPicker
              open={subjectOpen}
              setOpen={setSubjectOpen}
              value={subject}
              setValue={setSubject}
              items={subjects}
              placeholder="Select Subject"
              style={styles.input}
              dropDownContainerStyle={styles.dropDownContainer}
              listItemLabelStyle={styles.dropItemLabel}
              placeholderStyle={styles.placeholder}
              zIndex={4000}
              listMode="SCROLLVIEW"   // ← add this
            />
          </View>

          <Text style={styles.label}>Grade</Text>
          <View style={styles.z3000}>
            <DropDownPicker
              open={gradeOpen}
              setOpen={setGradeOpen}
              value={grade}
              setValue={setGrade}
              items={grades}
              placeholder="Select Grade"
              style={styles.input}
              dropDownContainerStyle={styles.dropDownContainer}
              listItemLabelStyle={styles.dropItemLabel}
              placeholderStyle={styles.placeholder}
              zIndex={3000}
              listMode="SCROLLVIEW"   // ← add this
            />
          </View>

          <Text style={styles.label}>Class Type</Text>
          <View style={styles.z2000}>
            <DropDownPicker
              open={classTypeOpen}
              setOpen={setClassTypeOpen}
              value={classType}
              setValue={setClassType}
              items={classTypes}
              placeholder="Class Type"
              style={styles.input}
              dropDownContainerStyle={styles.dropDownContainer}
              listItemLabelStyle={styles.dropItemLabel}
              placeholderStyle={styles.placeholder}
              zIndex={2000}
              listMode="SCROLLVIEW"   // ← add this
            />
          </View>
        </View>

        {/* Card: Schedule */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule</Text>

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.fieldButton}>
            <Ionicons name="calendar-outline" size={18} color="#088F9E" />
            <Text style={styles.fieldButtonText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
          )}

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Start time</Text>
              <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.fieldButton}>
                <Ionicons name="time-outline" size={18} color="#088F9E" />
                <Text style={styles.fieldButtonText}>{startTime || 'Select Start Time'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>End time</Text>
              <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.fieldButton}>
                <Ionicons name="time" size={18} color="#088F9E" />
                <Text style={styles.fieldButtonText}>{endTime || 'Select End Time'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={(e, time) => {
                setShowStartPicker(false);
                if (time) {
                  const formatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                  setStartTime(formatted);
                }
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={(e, time) => {
                setShowEndPicker(false);
                if (time) {
                  const formatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                  setEndTime(formatted);
                }
              }}
            />
          )}
        </View>

        {/* Card: Pricing & Capacity */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing & capacity</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Fee (LKR)</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="cash-outline" size={18} color="#94a3b8" />
                <TextInput
                  style={styles.inputBare}
                  placeholder="e.g., 1500"
                  value={fee}
                  onChangeText={(text) => setFee(text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Batch size</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="people-outline" size={18} color="#94a3b8" />
                <TextInput
                  style={styles.inputBare}
                  placeholder="e.g., 25"
                  value={batchSize}
                  onChangeText={(text) => setBatchSize(text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Card: Location */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>

          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="location-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.inputBare}
              placeholder="E.g., 55 Rajapihilla Mawatha, Kandy"
              value={locationInput}
              onChangeText={setLocationInput}
              placeholderTextColor="#94a3b8"
            />
          </View>

          {suggestions.length > 0 && (
  <View style={styles.suggestionList}>
    <ScrollView
      nestedScrollEnabled
      style={{ maxHeight: 180 }}
      keyboardShouldPersistTaps="handled"
    >
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={`${item.formatted}-${index}`}
          onPress={() => {
            setLocation(item.formatted);
            setLatitude(item.geometry.lat);
            setLongitude(item.geometry.lng);
            setLocationInput(item.formatted);
            setSuggestions([]);
          }}
          style={[styles.suggestionItem, index < suggestions.length - 1 && styles.suggestionItemDivider]}
        >
          <Ionicons name="pin-outline" size={16} color="#64748b" />
          <Text style={styles.suggestionText}>{item.formatted}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}


          <TouchableOpacity style={styles.mapOpenButton} onPress={() => setPickerVisible(true)}>
            <Ionicons name="map-outline" size={18} color="#fff" />
            <Text style={styles.mapOpenText}>Choose location on map</Text>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create new class</Text>
        </TouchableOpacity>
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Map modal (logic unchanged, styled header/footer) */}
      <Modal visible={pickerVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.modalHeaderBtn}>
              <Ionicons name="close" size={22} color="#0b3e45" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Pick location</Text>
            <View style={styles.modalHeaderBtn} />
          </View>

          {/* Search bar */}
          <View style={styles.modalSearchWrap}>
            <View style={styles.inputWithIcon}>
              <Ionicons name="search-outline" size={18} color="#94a3b8" />
              <TextInput
                value={pickerQuery}
                onChangeText={async (q) => {
                  setPickerQuery(q);
                  if (q.length < 3) return setPickerResults([]);
                  const results = await searchPlacesOpenCage(q);
                  setPickerResults(results);
                }}
                placeholder="Search a place"
                placeholderTextColor="#94a3b8"
                style={styles.inputBare}
              />
            </View>

            {pickerResults.length > 0 && (
              <View style={styles.modalResultList}>
                {pickerResults.map((r, idx) => (
                  <TouchableOpacity
                    key={`${r.formatted}-${idx}`}
                    onPress={() => {
                      setPickerResults([]);
                      setPickerQuery(r.formatted);
                      const lat = r.geometry.lat;
                      const lng = r.geometry.lng;
                      setPickedCoord({ lat, lng });
                      if (mapRef.current) {
                        mapRef.current.animateToRegion(
                          {
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                          },
                          300
                        );
                      }
                    }}
                    style={styles.modalResultItem}
                  >
                    <Ionicons name="pin" size={16} color="#64748b" />
                    <Text style={styles.modalResultText}>{r.formatted}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Map */}
          <MapView
            ref={mapRef}
            style={styles.modalMap}
            initialRegion={{
              latitude: latitude || deviceCoord?.lat || 7.8731,
              longitude: longitude || deviceCoord?.lng || 80.7718,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => {
              const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
              setPickedCoord({ lat, lng });
            }}
          >
            {pickedCoord && (
              <Marker
                draggable
                coordinate={{ latitude: pickedCoord.lat, longitude: pickedCoord.lng }}
                onDragEnd={(e) => {
                  const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
                  setPickedCoord({ lat, lng });
                }}
                title="Class Location"
              />
            )}
          </MapView>

          {/* Footer actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.button, styles.modalCancel]} onPress={() => setPickerVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (!pickedCoord) return Alert.alert('Pick a point on the map');
                try {
                  const r = await fetch(
                    `http://172.20.10.3:5000/api/utils/reverse?lat=${pickedCoord.lat}&lng=${pickedCoord.lng}`
                  );
                  const data = await r.json();

                  if (!r.ok || !data?.formatted) {
                    const url = `https://api.opencagedata.com/geocode/v1/json?q=${pickedCoord.lat}+${pickedCoord.lng}&key=${OPENCAGE_API_KEY}&limit=1&no_annotations=1`;
                    const { data: oc } = await axios.get(url);
                    const best = oc?.results?.[0];
                    if (!best) return Alert.alert('Could not resolve address');
                    const nice = prettyAddressFrom(best) || best.formatted;

                    setLatitude(pickedCoord.lat);
                    setLongitude(pickedCoord.lng);
                    setLocation(nice);
                    setLocationInput(nice);
                    setPickerVisible(false);
                    return;
                  }

                  const nice = data.formatted;
                  setLatitude(pickedCoord.lat);
                  setLongitude(pickedCoord.lng);
                  setLocation(nice);
                  setLocationInput(nice);
                  setPickerVisible(false);
                } catch (err) {
                  console.log('Reverse geocode failed', err?.response?.status || err.message);
                  Alert.alert('Error', 'Could not resolve address for that point.');
                }
              }}
            >
              <Text style={styles.buttonText}>Use this location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
