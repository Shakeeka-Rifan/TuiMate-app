import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F9F9',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  quizCard: {
    backgroundColor: '#ffffff',
      fontFamily: 'Nunito_700Bold',
    borderRadius: 20,
    padding: 25,
    width: '95%',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    top:90,
    marginLeft:10
  },
  questionHeader: {
    backgroundColor: '#D2F1EB',
    padding: 15,
      fontFamily: 'Nunito_700Bold',
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  questionNumber: {
    color: '#088F9E',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
      fontFamily: 'Nunito_700Bold',
  },
  questionText: {
    color: '#222',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
      fontFamily: 'Nunito_700Bold',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
    marginBottom: 12,
      fontFamily: 'Nunito_700Bold',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FAF7',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
      fontFamily: 'Nunito_700Bold',
  },
  optionCircle: {
    backgroundColor: '#088F9E',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
      fontFamily: 'Nunito_700Bold',
    marginRight: 12,
  },
  optionLetter: {
    color: 'white',
    fontWeight: 'bold',
      fontFamily: 'Nunito_700Bold',
  },
  optionLabel: {
    fontSize: 15,
    flex: 1,
    color: '#222',
      fontFamily: 'Nunito_700Bold',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderColor: '#088F9E',
  },
  button: {
    backgroundColor: '#088F9E',
    paddingVertical: 14,
    borderRadius: 14,
      fontFamily: 'Nunito_700Bold',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
      fontFamily: 'Nunito_700Bold',
  },
});

export default styles;
