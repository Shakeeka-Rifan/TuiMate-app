import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF7F8',
  },

  // Header
  pageHeader: {
    backgroundColor: '#088F9E',
    paddingHorizontal: 20,
    paddingVertical: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  headerLeft: { flexDirection: 'column' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
    top:10
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#E6FAFD',
    fontFamily: 'Nunito_400Regular',
     top:10
  },
  headerIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0A6F7C',
    alignItems: 'center',
    justifyContent: 'center',
     top:10
  },

  // Scroll content
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },

  // Card blocks
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#0b3e45',
    marginBottom: 10,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },

  // Labels & layout
  label: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 6,
    marginTop: 6,
    fontFamily: 'Nunito_400Regular',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },

  // Inputs
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  dropDownContainer: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropItemLabel: {
    color: '#0f172a',
  },
  placeholder: {
    color: '#94a3b8',
  },

  // Fancy field-style buttons (date/time)
  fieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  fieldButtonText: {
    fontSize: 13,
    color: '#0f172a',
    fontFamily: 'Nunito_400Regular',
  },

  // Icon + input combo
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  inputBare: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    fontFamily: 'Nunito_400Regular',
    paddingVertical: 2,
  },

  // Suggestions
  suggestionList: {
    maxHeight: 180,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  suggestionItemDivider: {
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontFamily: 'Nunito_400Regular',
  },

  // Map open button
  mapOpenButton: {
    marginTop: 6,
    backgroundColor: '#088F9E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  mapOpenText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
  },

  // Primary button (submit)
  button: {
    backgroundColor: '#088F9E',
    padding: 14,
    borderRadius: 12,
    marginTop: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 14,
    backgroundColor: '#E6F6F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    color: '#0b3e45',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  modalSearchWrap: {
    padding: 12,
  },
  modalResultList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  modalResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalResultText: {
    fontSize: 13,
    color: '#334155',
    fontFamily: 'Nunito_400Regular',
    flex: 1,
  },
  modalMap: {
    flex: 1,
  },
  modalFooter: {
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#f8fafc',
  },
  modalCancel: {
    backgroundColor: '#94a3b8',
  },

  // zIndex helpers for DropDownPicker stacking
  z4000: { zIndex: 4000, elevation: 4 },
  z3000: { zIndex: 3000, elevation: 3 },
  z2000: { zIndex: 2000, elevation: 2 },
  z1000: { zIndex: 1000, elevation: 1 },
});
