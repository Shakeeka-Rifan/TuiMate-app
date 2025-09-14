import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
      fontFamily: 'Poppins_700Bold',
      top:-95
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
     fontFamily: 'Poppins_400Regular',
     top:-95
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 8,
    marginBottom: 20,
    top:-95
  },
  button: {
    backgroundColor: '#088F9E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    top:-95
  },
  image: {
  width: '100%',
  height: 250,
  marginBottom: 20,
  top:-80
},

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
