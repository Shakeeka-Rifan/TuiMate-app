import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#EDF7F8',
    padding: 18,
  },

  // header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3E45',
    fontFamily: 'Nunito_700Bold',
  },

  // avatar
  avatarWrap: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#088F9E',
  },
  cameraFab: {
    position: 'absolute',
    bottom: 0,
    right: (18 + (100 - 100) / 2), // safe positioning
    backgroundColor: '#088F9E',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#0B3E45',
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Nunito_700Bold',
  },

  // inputs
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#0B3E45',
  },

  // dropdowns
  dropdown: {
    borderColor: '#E2E8F0',
    borderRadius: 12,
    minHeight: 48,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },

  // save
  saveBtn: {
    marginTop: 6,
    backgroundColor: '#088F9E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#088F9E',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
});
