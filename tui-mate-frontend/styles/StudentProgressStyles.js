import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF7F8',
  },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    top:20
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#088F9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    color: '#0B3E45',
    fontFamily: 'Nunito_700Bold',
    marginBottom: 30,
       top:15
  },

  scrollArea: {
    padding: 16,
    paddingBottom: 24,
  },

  // Range chips
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  rangeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#DFF7F6',
    borderRadius: 20,
  },
  rangeChipActive: {
    backgroundColor: '#088F9E',
  },
  rangeChipText: {
    color: '#0B3E45',
    fontSize: 12,
    fontFamily: 'Nunnito_700Bold',
  },
  rangeChipTextActive: {
    color: '#fff',
  },

  // KPI grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  kpiIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E7FAFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 20,
    color: '#0A0F12',
    fontFamily: 'Nunito_700Bold',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },

  // Blocks
  block: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  blockTitle: {
    fontSize: 15,
    color: '#0B3E45',
    fontFamily: 'Nunito_700Bold',
  },

  // Status bars
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  barLabel: {
    width: 84,
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Nunito_700Bold',
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#E5F3F4',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 6,
  },
  barFillCompleted: { backgroundColor: '#10B981' },
  barFillPending:   { backgroundColor: '#F59E0B' },
  barFillCancelled: { backgroundColor: '#EF4444' },
  barCount: {
    width: 30,
    textAlign: 'right',
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'Nunito_700Bold',
  },

  // Pills
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E8FAFA',
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    color: '#0B3E45',
    fontFamily: 'Nunito_700Bold',
  },

  emptyMini: {
    fontSize: 12.5,
    color: '#6B7280',
    fontFamily: 'Nunito_400Regular',
  },

  // Items
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9FEFE',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAF6F7',
  },
  itemThumb: { width: 44, height: 44, borderRadius: 8 },
  itemBody: { flex: 1 },
  itemTitle: {
    fontSize: 14,
    color: '#0A0F12',
    fontFamily: 'Nunito_700Bold',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Nunito_400Regular',
  },

  itemCardSoft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FCFEFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EAF2F4',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  itemTitleSoft: {
    fontSize: 13,
    color: '#0A0F12',
    fontFamily: 'Nunito_700Bold',
  },
  itemMetaSoft: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Nunito_400Regular',
  },

  // Shortcuts
  shortcutRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  shortcutBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  shortcutPrimary: {
    backgroundColor: '#088F9E',
  },
  shortcutGhost: {
    backgroundColor: '#E7FAFA',
    borderWidth: 1,
    borderColor: '#C7EEEE',
  },
  shortcutTextPrimary: {
    color: '#fff',
    fontSize: 13.5,
    fontFamily: 'Nunito_700Bold',
  },
  shortcutTextGhost: {
    color: '#088F9E',
    fontSize: 13.5,
    fontFamily: 'Nunito_700Bold',
  },
});
