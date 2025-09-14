// styles/ConfirmBookingStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF7F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Poppins_700Bold'
  },
  subject: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 15,
    fontFamily: 'Poppins_700Bold'
  },
  

  infoRow: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
    fontFamily: 'Poppins_400Regular'
  },

  confirmButton: {
    backgroundColor: '#088F9E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold'
  },
});
