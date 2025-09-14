// styles/ClassDetailsStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
    padding: 20,
  },
 backButton: {
    backgroundColor: '#088F9E',
    borderRadius: 30,
    padding: 10,
    width: 44,
   marginBottom:90
 
  },

  classCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,

  },
  classSubject: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  classDetail: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'Poppins_400Regular',
  },
  studentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#088F9E',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  studentsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: '#088F9E',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    textAlign:'center'
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
     textAlign:'center',
     top:10
  },
  
});
