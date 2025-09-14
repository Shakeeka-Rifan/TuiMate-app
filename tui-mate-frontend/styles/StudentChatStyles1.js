import { StyleSheet } from 'react-native';

export default StyleSheet.create({

    
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#088F9E',
    marginBottom: 16,
      fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    top:40
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    top:50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    top: 2
  },
  chatTextContainer: {
    flex: 1,
    justifyContent: 'center',
    top: -20
  },
  name: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    fontFamily: 'Nunito_700Bold',
    top:15
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito_400Regular',
      top:15
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
