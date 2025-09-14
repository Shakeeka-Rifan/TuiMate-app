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
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
    marginTop: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    color: '#222',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    marginBottom: 2,
  },
  messagePreview: {
    fontSize: 13.5,
    color: '#667085',
    fontFamily: 'Nunito_400Regular',
  },
  timeText: {
    fontSize: 12,
    color: '#98A2B3',
    marginRight: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
