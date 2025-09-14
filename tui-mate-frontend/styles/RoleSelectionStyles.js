// styles/RoleSelectionStyles.js
import { StyleSheet } from 'react-native';

const RoleSelectionStyles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: 'white', },
  backButton: {
    backgroundColor: '#088F9E',
    borderRadius: 30,
    padding: 10,
    width: 44,
    marginBottom: 10,
    top:30,
  },
  welcome: { fontSize: 29, fontWeight: 'bold', color: '#088F9E', textAlign: 'center', marginTop: 105, marginBottom: 6, fontFamily: 'Nunito_900Bold'},
  subheading: { fontSize: 18, color: '#333', textAlign: 'center', marginBottom: 20 , fontFamily: 'Nunito_400Regular'},
  card1: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#088F9E',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 13,
    height: 150
  },
  card: {
    marginTop: 16,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#088F9E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    height: 150,
  },
  imageStudent: { width: 110, height: 150, marginRight: 26, resizeMode: 'contain', left: -15, },
  textContainer: { flex: 1 },
  roleTitle: { fontSize: 20, fontWeight: 'bold' },
  roleDescription: { fontSize: 15, color: '#555' },

  imageTutor: { width: 117, height: 150, marginRight: 26, resizeMode: 'contain', left: -15,  },
  textContainer: { flex: 1 },
  roleTitle: { fontSize: 19, fontWeight: 'bold',  fontFamily: 'Nunito_700Bold', },
  roleDescription: { fontSize: 15, color: '#555',  fontFamily: 'Nunito_400Regular', },
});

export default RoleSelectionStyles;
