import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    top:10
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
     top:10
  },

  // Scroll content
  scrollArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Toolbar

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom:10
  },
  datePillActive: {
    backgroundColor: '#088F9E',
    borderColor: '#088F9E',
  },
  datePillText: {
    fontSize: 13,
    color: '#088F9E',
    fontFamily: 'Poppins_400Regular',
  },
  datePillTextActive: {
    color: '#fff',
  },
  clearDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearDateText: {
    fontSize: 12,
    color: '#0b3e45',
    fontFamily: 'Poppins_700Bold',
  },

  // Calendar modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  pickerSheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0b3e45',
    fontFamily: 'Poppins_700Bold',
  },
  pickerCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  pickerControl: {
    alignSelf: 'stretch',
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 6,
    paddingTop: 8,
  },
  pickerBtn: {
    backgroundColor: '#088F9E',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  pickerCancel: {
    backgroundColor: '#94a3b8',
  },
  pickerBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },

  // Filters
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 7,
    backgroundColor: '#d5eef1ff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E6F6F8',
  },
  filterChipActive: {
    backgroundColor: '#088F9E',
    borderColor: '#088F9E',
  },
  filterChipText: {
    fontSize: 12.5,
    color: '#0b3e45',
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  filterChipTextActive: {
    color: '#fff',
  },

  // Empty
  emptyWrap: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#0b3e45',
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  emptySub: {
    fontSize: 12,
    color: '#607280',
    marginTop: 4,
    fontFamily: 'Poppins_400Regular',
  },

  // Class card
  classCard: {
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',

  // use a white surface so shadow pops
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 12,
  marginBottom: 12,

  // iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,

  // Android shadow
  elevation: 6,
},
  thumbWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#EAFBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  classImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'Nunito_700Bold',
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F1FAFB',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E6F6F8',
  },
  chipText: {
    fontSize: 12,
    color: '#0b3e45',
    fontFamily: 'Nunito_400Regular',
  },
  chipSoft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#EAFBFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9F0F6',
  },
  chipSoftText: {
    fontSize: 12,
    color: '#088F9E',
    fontWeight: '600',
    fontFamily: 'Nunito_700Bold',
  },

  chevronIcon: {
    marginLeft: 8,
  },

  // Status badge
  badgePos: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#0b3e45',
  },
  badgeCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
  },
  badgeCancelled: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  badgePending: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  badgeDefault: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
});
