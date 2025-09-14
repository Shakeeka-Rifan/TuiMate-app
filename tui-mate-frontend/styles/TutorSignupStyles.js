import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#ffffffff',
    flexGrow: 1,
  },

  image: {
    width: 180,
    height: 140,
    alignSelf: 'center',
    marginBottom: -40,
    resizeMode: 'contain',
    top:-20
  
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#088F9E',
    marginBottom: 16,
    fontFamily: 'Nunito_700Bold',
  },

  input: {
    borderWidth: 0.3,
    borderColor: '#088F9E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#1b2b34',
  },

  // Dropdown base
  dropdown: {
    borderWidth: 0.3,
    borderColor: '#088F9E',
    borderRadius: 10,
    minHeight: 48,
  },
  dropdownContainer: {
    borderWidth: 0.3,
    borderColor: '#088F9E',
    borderRadius: 10,
  },

  // Wrapper z-index/elevation for overlay order (Android needs elevation)
  dropdownWrapperTop: { zIndex: 3000, elevation: 3000, marginBottom: 16 },
  dropdownWrapperMid: { zIndex: 2000, elevation: 2000, marginBottom: 16 },
  dropdownWrapperLow: { zIndex: 1000, elevation: 1000, marginBottom: 16 },

  
  uploadButton: {
    backgroundColor: '#088F9E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Nunito_700Bold',
  },

  signupButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButton:{
    backgroundColor: '#088F9E',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },

  signupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },

  backButton: {
    backgroundColor: '#088F9E',
    borderRadius: 30,
    padding: 10,
    width: 44,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginText: {
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Nunito_400Regular',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
});
