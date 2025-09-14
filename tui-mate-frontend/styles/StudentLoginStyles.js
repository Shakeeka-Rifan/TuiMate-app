import { StyleSheet } from 'react-native';

const PRIMARY = '#0A8F9E';
const TEXT_DARK = '#1F2A33';
const TEXT_MID = '#5C6B76';
const BORDER = '#E5ECF0';
const BG = '#F6FAFB';
const CARD_BG = '#FFFFFF';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  flex1: { flex: 1 },
  scroll: {
    padding: 20,
    paddingBottom: 28,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: PRIMARY,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
  },
  headerTextWrap: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
    fontFamily: 'Nunito_700Bold'
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    color: TEXT_MID,
    fontFamily: 'Nunito_400Regular'
  },

  /* Illustration */
  hero: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
  },

  /* Card */
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF3F6',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },

  /* Role pill */
  rolePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E6F6F8',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1EFF3',
    marginBottom: 12,
  },
  roleText: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 12,
       fontFamily: 'Nunito_700Bold'
  },

  /* Input rows */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFDFF',
    marginBottom: 12,
    height: 50,
    fontFamily: 'Nunito_400Regular'
  },
  inputIcon: {
    color: TEXT_MID,
    marginRight: 8,
    fontFamily: 'Nunito_400Regular'
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: TEXT_DARK,
    paddingVertical: 12,
    fontFamily: 'Nunito_400Regular'
  },
  eye: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },

  /* Button */
  button: {
    backgroundColor: PRIMARY,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 6,
    shadowColor: PRIMARY,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
     fontFamily: 'Nunito_700Bold'
  },

  /* Links */
  forgotPasswordText: {
    color: '#4db5ff',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular'
  },
  signupText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: TEXT_DARK,
       fontFamily: 'Nunito_700Bold'

  },
  signupLink: {
    color: PRIMARY,
    fontWeight: '700',
  },
});
