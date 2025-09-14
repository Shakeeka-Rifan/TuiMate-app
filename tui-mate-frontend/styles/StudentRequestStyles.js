import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF7F8',
  },

  // Header
  headerBar: {
      backgroundColor: '#088F9E',
    paddingHorizontal: 20,
    paddingVertical: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    
  },
  backButton: {
     width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    top:10,
    color:'#fff'
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
      top:10
  },
  headerTextWrap: { flex: 1, paddingHorizontal: 10 },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
      top:10
    
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
      top:10
  },

  // Count pill
  countRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
     top:20
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#DFF6FB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    
  },
  countText: {
    fontSize: 12,
    color: '#0B3E45',
    fontFamily: 'Nunito_700Bold',
  },

  // Scroll content
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
     top:20
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAF9FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#0B3E45',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
  },

  // Request card
  requestCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardAccent: {
    width: 4,
    backgroundColor: '#3CAEFF',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5F3F6',
  },
  info: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#0B3E45',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    marginRight: 8,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#334155',
    fontFamily: 'Nunito_400Regular',
  },

  // Status chip
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B3E45',
    fontFamily: 'Nunito_700Bold',
    textTransform: 'capitalize',
  },
  statusPending: { backgroundColor: '#FFF4E5' },
  statusAccepted: { backgroundColor: '#E6FAF0' },
  statusDeclined: { backgroundColor: '#FDECEC' },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  acceptButton: {
    backgroundColor: '#22C55E',
  },
  declineButton: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
});
