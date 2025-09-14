
// 📦 STYLES - ForgotPasswordStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    top:-90
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    top:-90
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    fontFamily: 'Poppins_400Regular',
    top:-90
  },
  button: {
    backgroundColor: '#088F9E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    top:-90
  },
  image: {
  width: '100%',
  height: 240,
  marginBottom: 10,
  top: -70
},

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold'
  },
});
