// styles/BookingConfirmedStyles.js
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
  icon: {
    width: 220,
    height: 220,
    marginBottom:-16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: '#088F9E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
