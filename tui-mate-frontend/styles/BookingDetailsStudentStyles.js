import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5FF',
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },

  ctionButton: {
  backgroundColor: '#088F9E',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 80,
  elevation: 2, // For Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
   marginHorizontal: 5, // ✅ Adds space between buttons
},

ctionButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  letterSpacing: 0.5,
}
,
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
     fontFamily: 'Nunito_700Bold'
  },
  subject: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
     fontFamily: 'Nunito_700Bold'
  },
  infoRow: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
     fontFamily: 'Nunito_700Bold'
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  actionButton: {
    backgroundColor: '#088F9E',
    borderRadius: 10,
    padding: 12,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
     fontFamily: 'Nunito_700Bold'
  },
});
