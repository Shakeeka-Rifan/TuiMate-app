import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: '#088F9E',
    borderRadius: 30,
    padding: 10,
    width: 44,
    marginBottom: 10,
    top:-120,
  },
  image: {
    width: 180,
    height: 140,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 10,
    top:-70,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#088F9E',
    marginBottom: 20,
    top:-105,
        fontFamily: 'Nunito_700Bold'

  },
  input: {
    borderWidth: 0.3,
  borderColor: '#088F9E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    top:-99,
        fontFamily: 'Nunito_400Regular'

  },
  loginButton: {
    backgroundColor: '#088F9E',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
    top:-90,
    
  },

  forgotPasswordText: {
    color: '#4db5ff',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
    fontSize: 14,
  },
  
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold'

   
  },
  signupText: {
    textAlign: 'center',
    color: '#444',
    top:-89,
    fontFamily: 'Nunito_400Regular',
    top:-10
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
