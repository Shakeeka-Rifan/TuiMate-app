import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
     fontFamily: 'Poppins_700Bold'
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: '#088F9E',
    borderWidth: 0.8,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    height: 120,
    marginBottom: 20,
     fontFamily: 'Poppins_400Regular'
  },
  submitButton: {
    backgroundColor: '#088F9E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
     fontFamily: 'Poppins_700Bold'
  },
});
