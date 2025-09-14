import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#EDF7F8',
    padding: 18,
    flexGrow: 1,
  },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    top:30
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0B3E45',
    fontFamily: 'Nunito_700Bold'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    top:37
  },
  cardTitle: {
    fontSize: 16,
    color: '#0B3E45',
    fontWeight: '700',
    marginBottom: 17,
   fontFamily: 'Nunito_700Bold'
  },

  inputGroup: {
    position: 'relative',
    marginBottom: 19,
    fontFamily: 'Nunito_400Regular'
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 40,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0B3E45',
    fontFamily: 'Nunito_400Regular'
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    fontFamily: 'Nunito_400Regular'
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Nunito_400Regular'
  },

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    marginTop: -4,
  },
  strengthBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    fontFamily: 'Nunito_400Regular'
  },
  strengthFill: {
    height: 8,
    borderRadius: 8,
    fontFamily: 'Nunito_400Regular'
  },
  strengthText: {
    fontSize: 12,
    color: '#64748b',
    minWidth: 86,
    textAlign: 'right',
    fontFamily: 'Nunito_400Regular'
  },

  tipsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 12,
    fontFamily: 'Nunito_400Regular'
  },
  tipText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },

  submitBtn: {
    backgroundColor: '#088F9E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#088F9E',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
     fontFamily: 'Nunito_700Bold'
  },
});
