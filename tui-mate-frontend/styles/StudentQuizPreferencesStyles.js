import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7F9', // Soft background
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizBox: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 24,
    width: '90%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
   questionNumber: {
    color: '#088F9E',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
      fontFamily: 'Nunito_700Bold',
  },
  title: {
   color: '#0e444aff',
    fontSize: 17,
    fontWeight: '700',
      fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
   questionHeader: {
    backgroundColor: '#D2F1EB',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
      fontFamily: 'Nunito_700Bold',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 18,
      fontFamily: 'Nunito_700Bold',
  },
  dropdown: {
    backgroundColor: '#F0FAFB',
      fontFamily: 'Nunito_700Bold',
    borderColor: '#088F9E',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownBox: {
    borderColor: '#088F9E',
    borderRadius: 15,
    backgroundColor: '#fff',
      fontFamily: 'Nunito_700Bold',
  },
  button: {
    backgroundColor: '#088F9E',
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 30,
      fontFamily: 'Nunito_700Bold',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
      fontFamily: 'Nunito_700Bold',
  },
});

export default styles;
