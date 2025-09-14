import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FEFE',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  backButton: {
       backgroundColor: '#088F9E',
    borderRadius: 30,
    padding: 10,
    width: 44,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    top:10
  },

  headerBooking: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
    fontFamily: 'Nunito_700Bold',
  },

  calendarContainer: {
    backgroundColor: '#beebebff',
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
  },

  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 10,
    fontFamily: 'Nunito_700Bold',
  },

  calendarMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#088F9E',
    fontFamily: 'Nunito_700Bold',
  },

  dateScrollContent: {
    flexDirection: 'row',
    paddingBottom: 6,
    fontFamily: 'Nunito_700Bold',
  },

  datePill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,
    fontFamily: 'Nunito_700Bold',
  },

  datePillSelected: {
    backgroundColor: '#6C63FF',
  },

  datePillDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    fontFamily: 'Nunito_700Bold',
  },

  datePillDaySelected: {
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },

  datePillWeekday: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Nunito_700Bold',
  },

  datePillWeekdaySelected: {
    color: '#e0e0e0',
    fontFamily: 'Nunito_700Bold',
  },

  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginTop: 4,
    fontFamily: 'Nunito_700Bold',
  },

  // 🔽 Dropdown
  filterSection: {
  marginTop: 10,
  marginBottom: 16,
  paddingHorizontal: 10,
  fontFamily: 'Nunito_700Bold',
},

filterLabelTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#555',
  marginBottom: 6,
  marginLeft: 6,
  fontFamily: 'Nunito_700Bold',
},

filterButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
 backgroundColor: '#cbf4f4ff',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 14,
  borderColor: '#088F9E',
  color: '#088F9E',
  borderWidth: 1,
  elevation: 2,
  fontFamily: 'Nunito_700Bold',
},

filterButtonText: {
  fontSize: 14,
color: '#088F9E',
  fontWeight: 'bold',
  flex: 1,
  textAlign: 'center',
  fontFamily: 'Nunito_700Bold',
},

filterLabelWrapper: {
  backgroundColor: '#cbf4f4ff',
  marginTop: 12,
  padding: 10,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Nunito_700Bold',
  elevation: 2,
  shadowColor: '#888',
  shadowOpacity: 0.15,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},

filterLabelText: {
  fontSize: 14,
  color: '#4B4B4B',
  fontWeight: '500',
  fontFamily: 'Nunito_700Bold',
},

highlightStatus: {
  color: '#088F9E',
  fontWeight: 'bold',
  fontFamily: 'Nunito_700Bold',
},

highlightDate: {
  color: '#999',
  fontStyle: 'italic',
  fontFamily: 'Nunito_700Bold',
},


dropdownCard: {
  marginTop: 8,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  paddingVertical: 6,
  elevation: 3,
  borderColor: '#eee',
  borderWidth: 1,
  fontFamily: 'Nunito_700Bold',
},

dropdownItemCard: {
  paddingVertical: 10,
  paddingHorizontal: 16,
},

dropdownItemText: {
  fontSize: 14,
  fontFamily: 'Nunito_700Bold',
  color: '#555',
},

dropdownItemActive: {
  backgroundColor: '#cbf4f4ff',
  borderRadius: 10,
  fontFamily: 'Nunito_700Bold',
},

dropdownItemTextActive: {
  color: '#088F9E',
  fontWeight: 'bold',
  fontFamily: 'Nunito_700Bold',
},


  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    borderColor: '#eee',
    borderWidth: 1,
    paddingVertical: 6,
    fontFamily: 'Nunito_700Bold',
  },

  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontFamily: 'Nunito_700Bold',
  },

  dropdownOptionText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Nunito_700Bold',
  },

  activeDropdownOption: {
    backgroundColor: '#F1F0FF',
    fontFamily: 'Nunito_700Bold',
  },

 requestCard: {
  backgroundColor: '#f1ffffff', // Pastel green background
  borderRadius: 18,
  borderWidth: 1.3,
  borderColor: '#73ceceff',
  padding: 16,
  marginVertical: 10,
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#90C8AC',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
  height:200
},

avatar: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 14,
  borderWidth: 2,
  borderColor: '#73ceceff',
},

info: {
  flex: 1,
  justifyContent: 'center',
},

name: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#088F9E',
  marginBottom: 4,
  fontFamily: 'Nunito_700Bold',
},

details: {
  fontSize: 13,
  color: '#4C4C4C',
  marginTop: 2,
  fontFamily: 'Nunito_700Bold',
},

detailsButton: {
  backgroundColor: '#088F9E',
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 8,
  alignSelf: 'center',
  top: 76,
  marginRight: -9,
},

viewMapButtonText: {
  color: '#fff',
  fontSize: 13,
  fontWeight: 'bold',
},

noRequests: {
  textAlign: 'center',
  color: '#B0B0B0',
  marginTop: 40,
  fontSize: 16,
  fontStyle: 'italic',
},


  viewMapButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold',
  },

  noRequests: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
  clearDateBtn: {
  alignSelf: 'flex-end',
  marginTop: 8,
  marginRight: 6,
  backgroundColor: '#FFEBEE',
  paddingVertical: 5,
  paddingHorizontal: 12,
  borderRadius: 12,
},

clearDateText: {
  color: '#D32F2F',
  fontSize: 12,
  fontWeight: 'bold',
  fontFamily: 'Nunito_700Bold',
},
badgeWrapper: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 6,
  width:200,
    marginBottom: 19,
},

badge: {
  fontSize: 12,
  fontWeight: '600',
  color: '#088F9E',
  backgroundColor: '#088F9E',
  fontFamily: 'Nunito_700Bold',
  paddingHorizontal: 12,
  paddingVertical: 3,
  borderRadius: 12,
  marginRight: 6,
  marginBottom: 4,
},


});
