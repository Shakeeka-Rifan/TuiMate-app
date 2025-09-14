import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FAF9',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  greenHeader: {
    
  
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -70,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 21,
    color: '#088F9E',
    marginLeft: 81,
    fontFamily: 'Nunito_700Bold',
    top:136
  },
  tutorCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  tutorName: {
    fontSize: 20,
   fontFamily: 'Nunito_700Bold',
    color: '#333',
  },
  subject: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  tutorRating: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  fee: {
    fontSize: 14,
    color: '#088F9E',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: '#088F9E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  locationButton1: {
    backgroundColor: '#088F9E',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 8,
  },
  locationButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionTitle: {
    fontSize: 17,
  fontFamily: 'Nunito_700Bold',
    color: '#088F9E',
    marginHorizontal: 16,
    marginTop: 17,
    marginBottom: 8,
  },
  classTimesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  classTimeBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    margin: 6,
    minWidth: 110,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C6F2EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  selectedClass: {
    backgroundColor: '#088F9E',
  },
  classText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
  },
  classTextSelected: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
        backgroundColor: '#b3e3dfff',
      width:200,
       borderRadius: 20,
    marginLeft:90,
    marginBottom:-10
  },
  tabButton: {
     backgroundColor: '#b3e3dfff',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 1,
  },
  activeTab: {
    backgroundColor: '#088F9E',
  },
  tabButtonText: {
    color: '#088F9E',
   fontFamily: 'Nunito_700Bold',
   
  },
  activeTabText: {
    color: 'white',
  },
  aboutText: {
    fontSize: 14,
    color: '#444',
    marginHorizontal: 16,
   fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  classTimeBox1: {
    flexDirection: 'row',
    backgroundColor: '#E6F9F5',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },


  classTimeCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: 12,
  marginHorizontal: 16,
  marginVertical: 6,
  borderRadius: 16,
  elevation: 3,
  shadowColor: '#000',
  shadowOpacity: 0.08,
   fontFamily: 'Nunito_700Bold',
  shadowRadius: 3,
  borderWidth: 1,
  borderColor: '#C6F2EB',
},

selectedCard: {
  backgroundColor: '#088F9E',
   fontFamily: 'Nunito_700Bold'
},

iconCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#D6F4F0',
  justifyContent: 'center',
  alignItems: 'center',
   fontFamily: 'Nunito_700Bold',
  marginRight: 12,
},

availabilityLabel: {
  fontSize: 12,
  color: '#666',
  fontFamily: 'Poppins_400Regular',
   fontFamily: 'Nunito_700Bold'
},

availabilityTime: {
  fontSize: 15,
  fontFamily: 'Poppins_700Bold',
  color: '#333',
   fontFamily: 'Nunito_700Bold'
},

// Optional if selected style changes
selectedCardText: {
  color: '#fff',
},

  reviewCardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewCardName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#333',
  },
  reviewCardRating: {
    fontSize: 12,
    color: '#FFA500',
    marginVertical: 2,
  },
  reviewCardText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#444',
  },
  bookButton: {
    margin: 20,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookButtonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: 'white',
  },


  //new
  // ✅ Horizontal scroll view container
reviewScrollContainer: {
  paddingHorizontal: 10,
  paddingBottom: 10,
},

// ✅ Review card styled like image
reviewCardGreen: {
     backgroundColor: '#ffffffff',
  flexDirection: 'row',
  borderRadius: 10,
  padding: 12,
  marginRight: 10,
  width: 300,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},

reviewCardAvatar: {
  width: 60,
  height: 50,
  borderRadius: 25,
  marginRight: 10,
},

reviewCardRightSection: {
  flex: 1,
  justifyContent: 'center',
},

reviewCardRowTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

reviewCardName: {
  fontSize: 17,
  fontWeight: 'bold',
  color: '#333',
   fontFamily: 'Nunito_700Bold'
},

reviewCardRatingText: {
  fontWeight: 'bold',
  color: '#555',
},

reviewCardCriticLabel: {
  color: '#666',
  fontSize: 10,
},

reviewCardRatingStars: {
  color: '#e7b251ff',
  fontSize: 13,
   fontFamily: 'Nunito_700Bold',
  marginBottom: 2,
},

reviewCardMeta: {
  fontSize: 10,
  color: '#999',
  marginBottom: 4,
},

reviewCardText: {
  color: '#333',
  fontSize: 12,
   fontFamily: 'Nunito_400Regular'
},
statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 39,
  paddingHorizontal: 40, // tighter spacing from screen sides
},

statsCard: {
  width: '23%', // tighter width to fit all 4 in 1 row
  backgroundColor: '#b4f0ecff',
  borderRadius: 12,
  paddingVertical: 4,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 3,
},


statsIconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#e0fcfcff',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 6,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
    fontFamily: 'Nunito_700Bold',
},

statsValue: {
  fontSize: 13,
  fontWeight: 'bold',
  color: '#088F9E',
    fontFamily: 'Nunito_700Bold',
},

statsLabel: {
  fontSize: 11,
  color: '#444',
    fontFamily: 'Nunito_700Bold',
  marginTop: 2,
  textAlign: 'center',
},


sectionTitle2: {
    fontSize: 18,
  fontFamily: 'Nunito_700Bold',
    color: '#088F9E',
    marginHorizontal: 16,
    marginTop: -60,
    marginBottom: 8,
  },

  profileCardContainer: {
  alignItems: 'center',
  marginTop: 195,
},

profileCard: {
  backgroundColor: '#fff',
  borderRadius: 20,
  paddingTop: 70,
  paddingBottom: 10,
  paddingHorizontal: 29,
  width: '85%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 4,
},

profileAvatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
  position: 'absolute',
  top: -50,
  borderWidth: 3,
  borderColor: '#fff',
},

profileName: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: -12,
  color: '#000',
   fontFamily: 'Nunito_700Bold',
},

profileSubject: {
  fontSize: 14,
  color: '#555',
  marginTop: 2,
   fontFamily: 'Nunito_700Bold',
},

profileFee: {
  fontSize: 14,
  color: '#64bbe7ff',
  marginTop: 4,
   fontFamily: 'Nunito_700Bold',
},

iconRow: {
  flexDirection: 'row',
  marginTop: 10,
  gap: 18,
},

iconCircle1: {
  backgroundColor: '#088F9E',
  padding: 10,
  borderRadius: 25,
},



});
