import { StyleSheet } from 'react-native';

const PRIMARY = '#0A8F9E';
const BG = '#F6FAFB';
const CARD = '#FFFFFF';
const TEXT_DARK = '#17212B';
const TEXT_MID = '#7A8A96';
const BORDER = '#E5ECF0';

const SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 3,
};

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 28 },

  /* Toast */
  toast: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(23,33,43,0.95)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...SHADOW,
  },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E9FAF8' },
  headerHello: { fontSize: 11, color: TEXT_MID },
  headerName: { fontSize: 16, color: TEXT_DARK, fontWeight: '800', maxWidth: 170 },

  notifyBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#beeef5ff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOW,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#FF4D4F',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  /* Hero card */
  welcomeCard: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOW,
  },
  welcomeDecorOne: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -20, left: -30,
  },
  welcomeDecorTwo: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -40, right: -30,
  },
  welcomeLeft: { flex: 1, gap: 6 },
  greeting: { color: '#fff', fontSize: 18, fontWeight: '800', fontFamily: 'Nunito_700Bold' },
  subGreeting: { color: '#ECFEFF', fontSize: 13, fontFamily: 'Nunito_400Regular', top: -4 },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  searchButton: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...SHADOW,
  },
  searchButtonText: { color: PRIMARY, fontWeight: '700', fontSize: 13, fontFamily: 'Nunito_700Bold' },
  chatButton: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    ...SHADOW,
  },
  welcomeRight: { width: 120, height: 100, justifyContent: 'center', alignItems: 'center' },
  welcomeImage: { width: 215, height: 130, resizeMode: 'contain' },

  /* Quick Nav */
  navGridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 6,
  },
  navGridBox: {
    backgroundColor: '#cfecf1ff',
    width: '24%',
    height: 78,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW,
  },
  navIcon: { width: 30, height: 34, resizeMode: 'contain', marginBottom: 6 },
  navGridText: { fontSize: 11, fontWeight: '700', color: PRIMARY, fontFamily: 'Nunito_700Bold' },

  /* Sections */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: PRIMARY,
    marginTop: 14,
    marginBottom: 10,
  },
  emptyText: { textAlign: 'center', color: TEXT_MID, marginVertical: 10 },

  /* ===== NEW: Progress Snapshot styles ===== */
  progressCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F6F8',
    marginBottom: 12,
    ...SHADOW,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitle: { fontSize: 15, fontWeight: '800', color: TEXT_DARK, fontFamily: 'Nunito_700Bold' },
  progressRangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FEFF',
    borderColor: '#DDF6F8',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  progressRangeText: { color: PRIMARY, fontSize: 12, fontWeight: '700' },

  progressRow: { flexDirection: 'row', alignItems: 'center' },

  percentBlock: {
    width: 96,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E9FAF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  percentValue: { fontSize: 24, fontWeight: '800', color: PRIMARY, fontFamily: 'Nunito_700Bold' },
  percentLabel: { fontSize: 11, color: '#033D3F', fontFamily: 'Nunito_700Bold' },

  progressTrack: {
    height: 10,
    backgroundColor: '#ECF4F6',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },

  statsRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7FAFC',
    borderColor: '#E8EEF3',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statText: { color: '#033D3F', fontSize: 12, fontWeight: '700', fontFamily: 'Nunito_700Bold' },

  subRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FEFF',
    borderColor: '#DDF6F8',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  subjectChipText: { color: PRIMARY, fontSize: 12, fontWeight: '700' },

  progressCTA: {
    backgroundColor: '#94cdc6ff',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginLeft:2
  },
  progressCTAText: { color: '#033D3F', fontWeight: '800', fontSize: 12 },

  /* Horizontal list spacing */
  hList: { paddingRight: 8, gap: 12 },

  /* Tutor PRO Card */
  tutorCardPro: {
    width: 210,
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F6F8',
    position: 'relative',
    overflow: 'hidden',
    ...SHADOW,
  },
  tutorDecorDot: {
    position: 'absolute',
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#F0FEFF',
    top: 6, right: 6,
  },
  tutorAvatarPro: {
    width: 66, height: 66, borderRadius: 36,
    marginBottom: 8, backgroundColor: '#EAFBFF',
  },
  ratingPill: {
    position: 'absolute',
    top: 8, left: 8,
    backgroundColor: 'rgba(23,33,43,0.75)',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingPillText: { color: '#fff', fontSize: 11, fontWeight: '700', fontFamily: 'Nunito_700Bold' },
  tutorNamePro: { fontWeight: '800', fontSize: 13, color: TEXT_DARK, marginBottom: 8, fontFamily: 'Nunito_700Bold' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  tag: {
    backgroundColor: '#F0FEFF',
    borderColor: '#DDF6F8',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: { color: PRIMARY, fontSize: 11, fontWeight: '700', fontFamily: 'Nunito_700Bold' },
  tagMuted: {
    backgroundColor: '#F7FAFC',
    borderColor: '#E8EEF3',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagMutedText: { color: TEXT_MID, fontSize: 11, fontWeight: '600', fontFamily: 'Nunito_700Bold' },
  tutorCTAPro: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  tutorCTATextPro: { color: '#fff', fontWeight: '800', fontSize: 12, fontFamily: 'Nunito_700Bold' },

  /* Class PRO Card */
  classCardPro: {
    width: 280,
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F6F8',
    overflow: 'hidden',
    ...SHADOW,
  },
  classTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classAvatar: { width: 54, height: 54, borderRadius: 28, marginRight: 10, backgroundColor: '#EAFBFF' },
  classTutor: { fontWeight: '800', fontSize: 13, color: TEXT_DARK, fontFamily: 'Nunito_700Bold' },
  classSubject: { fontSize: 12, color: TEXT_MID, fontFamily: 'Nunito_700Bold' },
  statusChip: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  statusChipText: { fontSize: 11, fontWeight: '800', color: '#fff', fontFamily: 'Nunito_700Bold' },
  statusAccepted: { backgroundColor: '#22C55E' },
  statusPending: { backgroundColor: '#F59E0B' },
  statusOther: { backgroundColor: '#64748B' },

  classRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  classMeta: { fontSize: 11, color: TEXT_MID, fontFamily: 'Nunito_700Bold' },

  classCTAPro: {
    backgroundColor: '#E9FAF8',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  classCTATextPro: { color: '#033D3F', fontWeight: '800', fontSize: 12, fontFamily: 'Nunito_700Bold' },

  /* Skeleton bits */
  skelAvatar: {
    width: 66, height: 66, borderRadius: 36, backgroundColor: '#EAF0F4', marginBottom: 10,
  },
  skelClassAvatar: {
    width: 54, height: 54, borderRadius: 28, backgroundColor: '#EAF0F4', marginRight: 10,
  },
  skelLine: {
    height: 10, backgroundColor: '#EAF0F4', borderRadius: 6, marginTop: 6, width: '70%',
  },
  skelLineWide: {
    height: 12, backgroundColor: '#EAF0F4', borderRadius: 6, width: '85%',
  },
  skelCircle: {
    width: 96,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#EAF0F4',
    marginRight: 12,
  },
  skelFill: { height: '100%', width: '50%', backgroundColor: '#EAF0F4' },

  shine: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
