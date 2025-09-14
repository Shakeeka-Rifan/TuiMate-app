import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';
import styles from '../styles/SearchTutorsStyles';

/* ----------------- Helpers (unchanged logic) ----------------- */

// Pick best coordinates to show distance for a tutor
const getBestCoords = (tutor) => {
  const now = new Date();

  if (Array.isArray(tutor.classes) && tutor.classes.length) {
    const toDate = (c) => new Date(`${c.date}T${c.startTime || '00:00'}`);
    const next = tutor.classes.find((c) => c.latitude && c.longitude && toDate(c) >= now);
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

// Haversine distance (km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

// Debounce utility
const useDebounced = (value, delay = 350) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

/* ----------------- Component ----------------- */

export default function SearchTutorsScreen({ route, navigation }) {
  const { studentId } = route.params;

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounced(searchQuery, 350);

  const [filteredTutors, setFilteredTutors] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [hideAIModalForever, setHideAIModalForever] = useState(false);

  // Filters
  const [filterSubject, setFilterSubject] = useState(null);
  const [filterGrade, setFilterGrade] = useState(null);
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterFeeRange, setFilterFeeRange] = useState('');
  const [filterGender, setFilterGender] = useState(null);
  const [filterDistance, setFilterDistance] = useState('');

  // Dropdown opens
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  // Credits
  const [credits, setCredits] = useState(null);
  const [isPro, setIsPro] = useState(false);

  // Location
  const [studentCoords, setStudentCoords] = useState(null);

  // Static lists
  const subjectOptions = useMemo(
    () => [
      { label: 'Maths', value: 'Maths' },
      { label: 'Science', value: 'Science' },
      { label: 'English', value: 'English' },
      { label: 'ICT', value: 'ICT' },
      { label: 'Sinhala', value: 'Sinhala' },
    ],
    []
  );
  const gradeOptions = useMemo(
    () => Array.from({ length: 13 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
    []
  );
  const locationOptions = useMemo(
    () => [
      { label: 'Colombo', value: 'Colombo' },
      { label: 'Kandy', value: 'Kandy' },
      { label: 'Kegalle', value: 'Kegalle' },
      { label: 'Mawanella', value: 'Mawanella' },
    ],
    []
  );

  // --- Case-insensitive manual search normalization ---
  // Without changing API or backend, we map user text to a canonical subject
  const subjectMap = useMemo(() => {
    const m = new Map();
    subjectOptions.forEach((s) => m.set(s.value.toLowerCase(), s.value));
    return m;
  }, [subjectOptions]);

  const canonicalizeSubject = (text) => {
    if (!text) return '';
    const t = text.trim().toLowerCase();
    if (subjectMap.has(t)) return subjectMap.get(t);
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  /* ----------------- API calls ----------------- */

  const searchTutors = async (filters = {}, isInitial = false) => {
    try {
      if (!isInitial) setListLoading(true);

      const params = new URLSearchParams(filters).toString();
      const response = await fetch(
        `http://172.20.10.3:5000/api/student/search/tutors?${params}`
      );
      const text = await response.text();
      const data = JSON.parse(text);

      let results = Array.isArray(data) ? data : [];

      // Optional front-end distance filter (does not change backend)
      if (filterDistance && studentCoords) {
        const maxKm = parseFloat(filterDistance);
        results = results.filter(
          (t) =>
            t.latitude &&
            t.longitude &&
            parseFloat(
              calculateDistance(
                studentCoords.latitude,
                studentCoords.longitude,
                t.latitude,
                t.longitude
              )
            ) <= maxKm
        );
      }

      setFilteredTutors(results);
    } catch (err) {
      console.error('Search error:', err);
      setFilteredTutors([]);
    } finally {
      setInitialLoading(false);
      setListLoading(false);
    }
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    const filters = {};
    if (searchQuery.trim() !== '') {
      filters.subject = canonicalizeSubject(searchQuery);
    }
    if (filterGrade) filters.grade = filterGrade;
    if (filterLocation) filters.location = filterLocation;
    if (filterFeeRange) filters.feeRange = filterFeeRange;
    if (filterGender) filters.gender = filterGender;

    await searchTutors(filters);

    // Log search (unchanged)
    if (searchQuery.trim() !== '') {
      fetch(`http://172.20.10.3:5000/api/students/interaction/search/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      }).catch((err) => console.error('Log search failed:', err));
    }
  };

  const handleFilterApply = async () => {
    const filters = {};
    if (filterSubject) filters.subject = filterSubject;
    if (filterGrade) filters.grade = filterGrade;
    if (filterLocation) filters.location = filterLocation;
    if (filterFeeRange) filters.feeRange = filterFeeRange;
    if (filterGender) filters.gender = filterGender;

    setFilterDistance('');

    await searchTutors(filters);
    setShowFilter(false);

    // Log filter usage (unchanged)
    fetch(`http://172.20.10.3:5000/api/students/interaction/filter/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: filterLocation,
        classType: filterSubject ? 'Subject Filter' : 'None',
      }),
    }).catch((err) => console.error('Log filter usage failed:', err));
  };

  // AI Match with “info” modal
  const runAIMatch = async () => {
    try {
      setListLoading(true);
      const res = await fetch(
        `http://172.20.10.3:5000/api/ai/ai-match/${studentId}`,
        { method: 'POST' }
      );

      if (res.status === 403) {
        const data = await res.json();
        Alert.alert(
          'Upgrade Required',
          `You have used all your free AI Match credits.\n${data?.remainingCredits ?? 0} left.\nUpgrade to Pro to continue.`
        );
        setListLoading(false);
        return;
      }

      const data = await res.json();
      setFilteredTutors(Array.isArray(data) ? data : []);
      Alert.alert('AI Match', 'Showing AI-matched tutors!');
    } catch (err) {
      console.error('AI Match error:', err);
      Alert.alert('Error', 'Failed to get AI matched tutors');
    } finally {
      setListLoading(false);
    }
  };

  const handleAIMatchPress = () => {
    if (hideAIModalForever) {
      runAIMatch();
    } else {
      setShowAIModal(true);
    }
  };

  /* ----------------- Effects ----------------- */

  // Location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location for distance-based results');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setStudentCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Initial load (no filters)
  useEffect(() => {
    searchTutors({}, true);
  }, []);

  // Credits badge (optional)
  useEffect(() => {
    fetch(`http://172.20.10.3:5000/api/student/credits/${studentId}`)
      .then((r) => r.json())
      .then((d) => {
        setCredits(d.aiCredits);
        setIsPro(d.isPro);
      })
      .catch(() => {});
  }, [studentId]);

  // (debouncedQuery reserved for future suggestions)
  useEffect(() => {}, [debouncedQuery]);

  /* ----------------- UI Pieces ----------------- */

  const Header = () => (
    <View style={styles.heroContainer}>
      <View style={styles.heroOverlay} />
      <View style={styles.heroContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0A5566" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Find Your Tutor</Text>
        <Text style={styles.heroSubtitle}>Search, filter, and get smart matches</Text>
      </View>
    </View>
  );

  const SearchBar = () => (
    <View style={styles.searchRow}>
      <View style={styles.searchInputWrap}>
        <Ionicons name="search" size={18} color="#6B8A99" style={{ marginHorizontal: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Try 'maths', 'science'..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          submitBehavior="submit"     // modern prop to keep focus
          blurOnSubmit={false}        // fallback on older RN
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery?.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={18} color="#6B8A99" style={{ marginHorizontal: 8 }} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilter(true)}>
        <Ionicons name="options" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.ctaBtn} onPress={handleSearch}>
        <Text style={styles.ctaBtnText}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiBtn} onPress={handleAIMatchPress}>
        <Ionicons name="sparkles" size={16} color="#fff" />
        <Text style={styles.aiBtnText}>
          AI {isPro ? 'Pro' : credits != null ? `(${credits} left)` : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ActiveChips = () => {
    const chips = [];
    if (filterSubject) chips.push({ k: 'Subject', v: filterSubject, onClear: () => setFilterSubject(null) });
    if (filterGrade) chips.push({ k: 'Grade', v: filterGrade, onClear: () => setFilterGrade(null) });
    if (filterLocation) chips.push({ k: 'Location', v: filterLocation, onClear: () => setFilterLocation(null) });
    if (filterFeeRange) chips.push({ k: 'Fee', v: filterFeeRange, onClear: () => setFilterFeeRange('') });
    if (filterGender) chips.push({ k: 'Gender', v: filterGender, onClear: () => setFilterGender(null) });
    if (filterDistance) chips.push({ k: 'Max km', v: filterDistance, onClear: () => setFilterDistance('') });

    if (!chips.length) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="always"   // keep keyboard up while interacting
        keyboardDismissMode="none"
      >
        {chips.map((c, i) => (
          <View key={i} style={styles.chip}>
            <Text style={styles.chipText}>{c.k}: {c.v}</Text>
            <TouchableOpacity onPress={c.onClear}>
              <Ionicons name="close-circle" size={16} color="#0A5566" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.clearAllChip}
          onPress={() => {
            setFilterSubject(null);
            setFilterGrade(null);
            setFilterLocation(null);
            setFilterFeeRange('');
            setFilterGender(null);
            setFilterDistance('');
          }}
        >
          <Ionicons name="trash" size={16} color="#fff" />
          <Text style={styles.clearAllChipText}>Clear all</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const TutorCard = ({ tutor }) => {
    const { lat, lng } = getBestCoords(tutor);
    const distanceLabel =
      lat && lng && studentCoords
        ? `${calculateDistance(studentCoords.latitude, studentCoords.longitude, lat, lng)} km`
        : (tutor.location || 'Unknown');

    return (
      <View style={styles.tutorCard}>
        <View style={styles.cardLeft}>
          <Image
            source={
              tutor.profileImage
                ? { uri: `http://172.20.10.3:5000/${tutor.profileImage}` }
                : require('../assets/images/avatar.png')
            }
            style={styles.avatar}
          />
        </View>

        <View style={styles.cardRight}>
          <View style={styles.nameRow}>
            <Text style={styles.tutorName} numberOfLines={1}>{tutor.name}</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={12} color="#FFB020" />
              <Text style={styles.ratingText}>
                {tutor?.rating?.count > 0 ? tutor?.rating?.value?.toFixed(1) : '—'}
              </Text>
            </View>
          </View>

          <Text style={styles.subject} numberOfLines={1}>
            {tutor.subject || tutor.subjects?.[0] || 'Subject'}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons name="book" size={12} color="#0A5566" />
              <Text style={styles.metaText}>Grade {tutor.grade || 'N/A'}</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="location" size={12} color="#0A5566" />
              <Text style={styles.metaText}>{distanceLabel}</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="cash" size={12} color="#0A5566" />
              <Text style={styles.metaText}>Rs. {tutor.fee || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() =>
                navigation.navigate('TutorDetails', {
                  tutorId: tutor._id,
                  subject: tutor.subject || tutor.subjects?.[0] || 'N/A',
                  studentId,
                })
              }
            >
              <Text style={styles.secondaryBtnText}>View profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Saved', 'Added to shortlist')}>
              <Ionicons name="heart" size={14} color="#fff" />
              <Text style={styles.primaryBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Image
        source={require('../assets/images/searching.png')}
        style={styles.emptyImg}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>No tutors found</Text>
      <Text style={styles.emptySubtitle}>
        Try changing the subject or filters. You can also use AI Match for personalized picks.
      </Text>
    </View>
  );

  /* ----------------- Render ----------------- */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        <Header />
        <SearchBar />
        <ActiveChips />

        {initialLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#0A5566" />
            <Text style={styles.loaderText}>Loading tutors…</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"  // keep taps from dismissing
            keyboardDismissMode="none"          // don't dismiss on drag
          >
            {listLoading && (
              <View style={styles.inlineLoader}>
                <ActivityIndicator size="small" color="#0A5566" />
                <Text style={styles.inlineLoaderText}>Fetching results…</Text>
              </View>
            )}

            {filteredTutors.length === 0 ? (
              <EmptyState />
            ) : (
              filteredTutors.map((tutor, idx) => (
                <TutorCard key={tutor._id || idx} tutor={tutor} />
              ))
            )}
          </ScrollView>
        )}

        {/* Filters Bottom Sheet */}
        <Modal visible={showFilter} animationType="slide" transparent>
          <View style={styles.filterModal}>
            <View style={styles.filterHeaderRow}>
              <Text style={styles.filterTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <Ionicons name="close" size={22} color="#0A5566" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Subject</Text>
            <View style={{ zIndex: 4000 }}>
              <DropDownPicker
                open={subjectOpen}
                value={filterSubject}
                items={subjectOptions}
                setOpen={setSubjectOpen}
                setValue={setFilterSubject}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownBox}
                placeholder="Select Subject"
                textStyle={styles.dropdownText}
                labelStyle={styles.dropdownLabel}
              />
            </View>

            <Text style={styles.label}>Grade</Text>
            <View style={{ zIndex: 3000 }}>
              <DropDownPicker
                open={gradeOpen}
                value={filterGrade}
                items={gradeOptions}
                setOpen={setGradeOpen}
                setValue={setFilterGrade}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownBox}
                placeholder="Select Grade"
                textStyle={styles.dropdownText}
                labelStyle={styles.dropdownLabel}
              />
            </View>

            <Text style={styles.label}>Max Distance (km)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5"
              keyboardType="numeric"
              value={filterDistance}
              onChangeText={setFilterDistance}
            />

            <Text style={styles.label}>Fee Range</Text>
            <TextInput
              style={styles.input}
              placeholder="1000-2000"
              value={filterFeeRange}
              onChangeText={setFilterFeeRange}
            />

            <Text style={styles.label}>Gender</Text>
            <View style={{ zIndex: 2000 }}>
              <DropDownPicker
                open={genderOpen}
                value={filterGender}
                items={[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                  { label: 'Other', value: 'Other' },
                ]}
                setOpen={setGenderOpen}
                setValue={setFilterGender}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownBox}
                placeholder="Select Gender"
                textStyle={styles.dropdownText}
                labelStyle={styles.dropdownLabel}
              />
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity onPress={handleFilterApply} style={styles.showButton}>
                <Text style={styles.buttonText}>Show results</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFilterSubject(null);
                  setFilterGrade(null);
                  setFilterLocation(null);
                  setFilterFeeRange('');
                  setFilterGender(null);
                  setFilterDistance('');
                  setShowFilter(false);
                }}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* AI Info Modal */}
        <Modal visible={showAIModal} animationType="fade" transparent>
          <View style={styles.aiModalBackdrop}>
            <View style={styles.aiModal}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={18} color="#0A5566" />
                <Text style={styles.aiTitle}>AI Match</Text>
              </View>
              <Text style={styles.aiDesc}>
                AI Match ranks tutors using your preferences (subjects, study time, class type, etc.).
                You may have limited free AI credits. Pro users get unlimited matches.
              </Text>
              <View style={styles.aiHintRow}>
                <Ionicons name="information-circle" size={16} color="#0A5566" />
                <Text style={styles.aiHintText}>Tip: manual filters still apply after AI Match.</Text>
              </View>

              <View style={styles.aiFooterRow}>
                <TouchableOpacity
                  style={styles.aiCheckRow}
                  onPress={() => setHideAIModalForever((v) => !v)}
                >
                  <Ionicons
                    name={hideAIModalForever ? 'checkbox' : 'square-outline'}
                    size={18}
                    color="#0A5566"
                  />
                  <Text style={styles.aiCheckText}>Don’t show again</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={styles.aiCancelBtn}
                    onPress={() => setShowAIModal(false)}
                  >
                    <Text style={styles.aiCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.aiContinueBtn}
                    onPress={() => {
                      setShowAIModal(false);
                      runAIMatch();
                    }}
                  >
                    <Text style={styles.aiContinueText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
