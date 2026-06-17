import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Modal,
  Keyboard,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

import {
  responsiveScreenWidth,
  responsiveScreenHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useRemoveProfilePhotoMutation,
  useGetAllInterestsQuery,
  useGetUserInterestsQuery,
  useSaveUserInterestsMutation,
} from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─────────────── THEME — #2C3E50 ─────────────── */
const COLORS = {
  primary: '#2C3E50',
  primaryLight: '#3D5166',
  primaryDark: '#1A2B38',
  primaryBg: '#EAF0F6',
  accent: '#2980B9',
  accentLight: '#D6EAF8',
  bg: '#F0F3F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F6F9',
  border: '#DCE3ED',
  borderActive: '#2C3E50',
  text: '#1A2B38',
  textSecondary: '#4A5E72',
  textMuted: '#8FA3B1',
  disabledText: '#A5B8C5',
  error: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
};

/* ─────────────── COUNTRY LIST ─────────────── */
const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Guatemala',
  'Guinea',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Libya',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palestine',
  'Panama',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

/* ─────────────── STYLES ─────────────── */
const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  scrollContent: {
    paddingHorizontal: responsiveScreenWidth(5),
    paddingBottom: responsiveScreenHeight(16),
    paddingTop: responsiveScreenHeight(1.5),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  headerIcon: {
    width: 22,
    height: 22,
    tintColor: '#2C3E50',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: responsiveScreenHeight(2.5),
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarOuter: {
    width: responsiveScreenWidth(28),
    height: responsiveScreenWidth(28),
    borderRadius: responsiveScreenWidth(14),
    backgroundColor: COLORS.surface,
    padding: 3,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveScreenWidth(13),
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.surface,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  cameraIco: { width: 16, height: 16, tintColor: '#FFF' },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: responsiveScreenWidth(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  avatarEmail: {
    fontSize: responsiveFontSize(1.65),
    color: COLORS.textMuted,
    marginTop: 3,
    textAlign: 'center',
  },
  removePhotoBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.error + '20',
    borderRadius: 20,
    alignSelf: 'center',
  },
  removePhotoTxt: {
    color: COLORS.error,
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: responsiveFontSize(1.35),
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginTop: responsiveScreenHeight(2.5),
    marginBottom: responsiveScreenHeight(1),
    paddingLeft: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: responsiveScreenHeight(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1.75),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLast: { borderBottomWidth: 0 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconTxt: { fontSize: 18 },
  fieldWrap: { flex: 1 },
  fieldLbl: {
    fontSize: responsiveFontSize(1.38),
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  fieldVal: {
    fontSize: responsiveFontSize(1.85),
    color: COLORS.text,
    fontWeight: '600',
    padding: 0,
    margin: 0,
  },
  fieldDisabled: { color: COLORS.textSecondary, fontWeight: '500' },
  fieldPlaceholder: { color: COLORS.textMuted, fontWeight: '400' },
  chevron: { fontSize: 22, color: COLORS.primary, marginLeft: 8 },
  reqDot: { color: COLORS.error },
  toggleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1.75),
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: responsiveScreenHeight(1.5),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleLbl: {
    fontSize: responsiveFontSize(1.85),
    color: COLORS.text,
    fontWeight: '600',
  },
  toggleSub: {
    fontSize: responsiveFontSize(1.38),
    color: COLORS.textMuted,
    marginTop: 2,
  },
  track: {
    width: 50,
    height: 29,
    borderRadius: 15,
    padding: 2.5,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 4,
  },
  taCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: responsiveScreenWidth(4),
    marginBottom: responsiveScreenHeight(1),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  taHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  taIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  taLbl: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  taInput: {
    fontSize: responsiveFontSize(1.75),
    color: COLORS.text,
    lineHeight: 23,
    minHeight: 110,
    textAlignVertical: 'top',
  },
  wcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  wcTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  wcFill: { height: '100%', borderRadius: 2 },
  wcTxt: {
    fontSize: responsiveFontSize(1.38),
    color: COLORS.textMuted,
    fontWeight: '600',
    minWidth: 52,
    textAlign: 'right',
  },
  bottomBar: {
    paddingHorizontal: responsiveScreenWidth(5),
    paddingVertical: responsiveScreenHeight(1.5),
    paddingBottom:
      Platform.OS === 'ios'
        ? responsiveScreenHeight(3.5)
        : responsiveScreenHeight(2),
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: responsiveScreenHeight(1.9),
    alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 10,
  },
  saveTxt: {
    color: '#FFF',
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 43, 56, 0.52)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    maxHeight: responsiveScreenHeight(75),
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 18,
  },
  mHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  mTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  mCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mCloseTxt: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '700' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: responsiveScreenHeight(1.2),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIco: { fontSize: 15, marginRight: 8 },
  searchIn: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: COLORS.text,
    padding: 0,
  },
  mItem: {
    paddingVertical: responsiveScreenHeight(1.6),
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mItemSel: { backgroundColor: COLORS.primaryBg },
  mItemTxt: {
    fontSize: responsiveFontSize(1.85),
    color: COLORS.text,
    fontWeight: '500',
  },
  mItemTxtSel: { color: COLORS.primary, fontWeight: '700' },
  mItemDisabled: { opacity: 0.6 },
  mCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mCheckTxt: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  mDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 24 },
  mFooter: { height: Platform.OS === 'ios' ? 36 : 20 },
  noResults: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: responsiveFontSize(1.7),
    paddingVertical: 32,
  },
  addedBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  addedBadgeText: {
    color: COLORS.success,
    fontSize: responsiveFontSize(1.2),
    fontWeight: '600',
  },
  saveInterestsBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 24,
    marginTop: 12,
    alignItems: 'center',
  },
  saveInterestsTxt: {
    color: '#FFF',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
  },
});

/* ─────────────── PICKER MODAL (single select) ─────────────── */
interface PickerModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  searchable?: boolean;
  onSelect: (v: string) => void;
  onClose: () => void;
}

const PickerModal = ({
  visible,
  title,
  options,
  selected,
  searchable,
  onSelect,
  onClose,
}: PickerModalProps) => {
  const [query, setQuery] = useState('');
  const filtered = query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    if (!visible) setQuery('');
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={S.overlay} onPress={onClose}>
        <Pressable style={S.sheet} onPress={() => { }}>
          <View style={S.handle} />
          <View style={S.mHeader}>
            <Text style={S.mTitle}>{title}</Text>
            <Pressable style={S.mCloseBtn} onPress={onClose}>
              <Text style={S.mCloseTxt}>✕</Text>
            </Pressable>
          </View>
          {searchable && (
            <View style={S.searchRow}>
              <Text style={S.searchIco}>🔍</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search country..."
                placeholderTextColor={COLORS.textMuted}
                style={S.searchIn}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')}>
                  <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>
                    ✕
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          <FlatList
            data={filtered}
            keyExtractor={item => item}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={S.mDivider} />}
            ListEmptyComponent={
              <Text style={S.noResults}>No results found</Text>
            }
            renderItem={({ item }) => (
              <Pressable
                style={[S.mItem, selected === item && S.mItemSel]}
                onPress={() => onSelect(item)}
              >
                <Text style={[S.mItemTxt, selected === item && S.mItemTxtSel]}>
                  {item}
                </Text>
                {selected === item && (
                  <View style={S.mCheck}>
                    <Text style={S.mCheckTxt}>✓</Text>
                  </View>
                )}
              </Pressable>
            )}
          />
          <View style={S.mFooter} />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* ─────────────── INTEREST MODAL (multi-select with disabled pre-selected) ─────────────── */
interface InterestModalProps {
  visible: boolean;
  allInterests: { id: number; name: string }[];
  selectedIds: number[];
  disabledIds: number[];
  onConfirm: (ids: number[]) => void;
  onClose: () => void;
}

const InterestModal = ({
  visible,
  allInterests,
  selectedIds,
  disabledIds,
  onConfirm,
  onClose,
}: InterestModalProps) => {
  const [tempSelected, setTempSelected] = useState<number[]>(selectedIds);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) {
      // Ensure all disabled IDs are included in tempSelected
      const union = [...new Set([...disabledIds, ...selectedIds])];
      setTempSelected(union);
      setQuery('');
    }
  }, [visible, selectedIds, disabledIds]);

  const toggleInterest = (id: number) => {
    if (disabledIds.includes(id)) return;
    setTempSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const filtered = query.trim()
    ? allInterests.filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase()),
    )
    : allInterests;

  const handleDone = () => {
    onConfirm(tempSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={S.overlay} onPress={onClose}>
        <Pressable style={S.sheet} onPress={() => { }}>
          <View style={S.handle} />
          <View style={S.mHeader}>
            <Text style={S.mTitle}>Select Interests</Text>
            <Pressable style={S.mCloseBtn} onPress={onClose}>
              <Text style={S.mCloseTxt}>✕</Text>
            </Pressable>
          </View>
          <View style={S.searchRow}>
            <Text style={S.searchIco}>🔍</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search interests..."
              placeholderTextColor={COLORS.textMuted}
              style={S.searchIn}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>✕</Text>
              </Pressable>
            )}
          </View>
          <FlatList
            data={filtered}
            keyExtractor={item => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={S.mDivider} />}
            ListEmptyComponent={
              <Text style={S.noResults}>No interests found</Text>
            }
            renderItem={({ item }) => {
              const isSelected = tempSelected.includes(item.id);
              const isDisabled = disabledIds.includes(item.id);
              return (
                <Pressable
                  style={[
                    S.mItem,
                    isSelected && S.mItemSel,
                    isDisabled && S.mItemDisabled,
                  ]}
                  onPress={() => toggleInterest(item.id)}
                  disabled={isDisabled}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={[
                        S.mItemTxt,
                        isSelected && S.mItemTxtSel,
                        isDisabled && { color: COLORS.textMuted },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isDisabled && (
                      <View style={S.addedBadge}>
                        <Text style={S.addedBadgeText}>Added</Text>
                      </View>
                    )}
                  </View>
                  {isSelected && (
                    <View style={S.mCheck}>
                      <Text style={S.mCheckTxt}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
          <Pressable style={S.saveInterestsBtn} onPress={handleDone}>
            <Text style={S.saveInterestsTxt}>Done</Text>
          </Pressable>
          <View style={S.mFooter} />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* ─────────────── FIELD ROW ─────────────── */
interface FieldRowProps {
  icon: string;
  label: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  onChangeText?: (t: string) => void;
  editable?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  isSelect?: boolean;
  keyboardType?: any;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
}

const FieldRow = ({
  icon,
  label,
  required,
  value,
  placeholder,
  onChangeText,
  editable = true,
  isLast,
  onPress,
  isSelect,
  keyboardType,
  pointerEvents = 'auto',
}: FieldRowProps) => {
  const inner = (
    <View style={[S.row, isLast && S.rowLast]} pointerEvents={pointerEvents}>
      <View style={S.iconBox}>
        <Text style={S.iconTxt}>{icon}</Text>
      </View>
      <View style={S.fieldWrap}>
        <Text style={S.fieldLbl}>
          {label}
          {required && <Text style={S.reqDot}> *</Text>}
        </Text>
        {editable && !isSelect ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            style={S.fieldVal}
            keyboardType={keyboardType}
            editable={editable}
          />
        ) : (
          <Text
            style={[
              S.fieldVal,
              !editable && S.fieldDisabled,
              !value && S.fieldPlaceholder,
            ]}
          >
            {value || placeholder}
          </Text>
        )}
      </View>
      {isSelect && <Text style={S.chevron}>›</Text>}
    </View>
  );
  return onPress ? (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {inner}
    </TouchableOpacity>
  ) : (
    inner
  );
};

/* ─────────────── MAIN SCREEN ─────────────── */
export default function EditProfile({ navigation }: any) {
  const scrollRef = useRef<ScrollView>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [budgetSelect, setBudgetSelect] = useState('');
  const [budgetDesc, setBudgetDesc] = useState('');
  const [hasDogs, setHasDogs] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  // Interest related
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);
  const [interestModalVisible, setInterestModalVisible] = useState(false);

  // Modals
  const [ageModal, setAgeModal] = useState(false);
  const [budgetModal, setBudgetModal] = useState(false);
  const [countryModal, setCountryModal] = useState(false);

  // API hooks
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [removeProfilePhotoMutation, { isLoading: isRemovingPhoto }] =
    useRemoveProfilePhotoMutation();

  // We still import saveUserInterests hook but we won't use it for saving here
  // (we send interests inside the profile update)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [saveUserInterests, { isLoading: isSavingInterests }] =
    useSaveUserInterestsMutation();

  const initialized = useRef(false);

  const MAX_WORDS = 200;
  const AGE_OPTIONS = ['18-24', '25-35', '36-50', '50+'];
  const BUDGET_OPTIONS = [
    'Below $100',
    '$100 - $400',
    '$500 - $1000',
    '$1000+',
  ];

  const [isSaving, setIsSaving] = useState(false);
  const {
    data: profileResponse,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetUserProfileQuery();

  // Fetch all interests and user's interests
  const { data: allInterests = [], isLoading: interestsLoading } =
    useGetAllInterestsQuery();
  const {
    data: userInterests = [],
    isLoading: userInterestsLoading,
    refetch: refetchUserInterests,
  } = useGetUserInterestsQuery();

  // Build map for quick name lookup
  const interestMap = useRef<Record<number, string>>({});
  useEffect(() => {
    if (allInterests.length) {
      interestMap.current = allInterests.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<number, string>);
    }
  }, [allInterests]);

  // On focus, reset and refetch
  useFocusEffect(
    useCallback(() => {
      initialized.current = false;
      refetchProfile();
      refetchUserInterests();
      setTimeout(
        () => scrollRef.current?.scrollTo({ y: 0, animated: true }),
        100,
      );
      return () => setImageChanged(false);
    }, [refetchProfile, refetchUserInterests]),
  );

  // Load profile data
  useEffect(() => {
    if (!initialized.current && profileResponse?.success) {
      initialized.current = true;
      const u = profileResponse.data.user;

      setName(u.full_name ?? '');
      setEmail(u.email ?? '');
      setCountry(u.country ?? '');
      setCity(u.profile?.city ?? '');
      setAge(u.profile?.age_band ?? '');
      setBudgetSelect(u.profile?.dining_budget ?? '');
      setBudgetDesc(u.profile?.budget_description ?? '');

      const hasDogsValue = u.profile?.has_dogs;
      setHasDogs(hasDogsValue === '1' || hasDogsValue === 1);

      setProfileImageUrl(u.profile?.profile_image ?? null);
      setImageChanged(false);
    }
  }, [profileResponse]);

  // Load user interests
  useEffect(() => {
    if (userInterests.length) {
      const ids = userInterests.map(i => i.id);
      setSelectedInterestIds(ids);
    }
  }, [userInterests]);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const g = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs camera access',
        buttonPositive: 'OK',
      },
    );
    return g === PermissionsAndroid.RESULTS.GRANTED;
  };

  const uploadImageImmediately = async (imageData: any) => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      const imageFile = {
        uri:
          Platform.OS === 'ios'
            ? imageData.uri.replace('file://', '')
            : imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.name || `profile_${Date.now()}.jpg`,
      };
      formData.append('profile_image', imageFile as any);

      const result = await updateUserProfile(formData).unwrap();
      if (result.success) {
        if (result.data?.profile_image) {
          setProfileImageUrl(result.data.profile_image);
        } else {
          await refetchProfile();
        }
        setImageChanged(false);
        Alert.alert('Success', 'Profile photo updated successfully');
      }
    } catch (error: any) {
      console.log('Upload error:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const openCamera = async () => {
    if (!(await requestCameraPermission())) return;
    launchCamera(
      { mediaType: 'photo', quality: 0.7, includeBase64: false },
      response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (!asset?.uri) return;
        const imageData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `camera_${Date.now()}.jpg`,
        };
        uploadImageImmediately(imageData);
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (!asset?.uri) return;
      const imageData = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `gallery_${Date.now()}.jpg`,
      };
      uploadImageImmediately(imageData);
    });
  };

  const handleRemovePhoto = async () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await removeProfilePhotoMutation().unwrap();
              if (result.code === 200) {
                setProfileImageUrl(null);
                setImageChanged(true);
                await refetchProfile();
                Alert.alert('Success', 'Profile photo removed successfully');
              } else {
                throw new Error(result.message || 'Failed to remove photo');
              }
            } catch (error: any) {
              console.log('Remove photo error:', error);
              Alert.alert(
                'Error',
                error?.data?.message ||
                error?.message ||
                'Failed to remove profile photo.',
              );
            }
          },
        },
      ],
    );
  };

  const handleBudgetDescChange = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= MAX_WORDS || text.length < budgetDesc.length)
      setBudgetDesc(text);
  };

  // Save main profile + interests in one call
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append('age_band', age || '');
      formData.append('city', city || '');
      formData.append('dining_budget', budgetSelect || '');
      formData.append('has_dogs', hasDogs ? '1' : '0');
      formData.append('country', country || '');
      if (budgetDesc) formData.append('budget_description', budgetDesc);
      if (imageChanged && profileImageUrl) {
        formData.append('profile_image', profileImageUrl);
      }

      // Append interests as array
      selectedInterestIds.forEach(id => {
        formData.append('interests[]', String(id));
      });

      const result = await updateUserProfile(formData).unwrap();
      await refetchProfile();
      await refetchUserInterests(); // refresh interest list after update

      navigation.goBack();
      setTimeout(() => {
        Alert.alert('Saved!', result.message || 'Profile updated successfully');
      }, 300);
    } catch (err: any) {
      console.log('Save error:', err);
      Alert.alert(
        'Error',
        err?.data?.message ||
        err?.message ||
        'Update failed. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update local interest selection (called from modal)
  const handleConfirmInterests = (ids: number[]) => {
    setSelectedInterestIds(ids);
  };

  // Build display string for selected interests
  const getInterestDisplay = () => {
    if (!selectedInterestIds.length) return 'Select your interests';
    const names = selectedInterestIds
      .map(id => interestMap.current[id])
      .filter(Boolean);
    return names.join(', ');
  };

  const displayImage = () => {
    if (profileImageUrl) return { uri: profileImageUrl };
    return require('../../../../assets/image/nophoto.jpg');
  };

  const isLoading =
    isSaving ||
    profileLoading ||
    isUpdating ||
    isRemovingPhoto ||
    isUploadingImage ||
    interestsLoading ||
    userInterestsLoading;

  // IDs of interests that are already added (disabled in modal)
  const disabledInterestIds = userInterests.map(i => i.id);

  return (
    <SafeAreaView style={S.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <Loader visible={isLoading} />

      <View style={S.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../../assets/image/left-icon.png')}
            style={S.headerIcon}
          />
        </Pressable>
        <Text style={S.headerTitle}>Edit Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={S.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Avatar Section ── */}
          <View style={S.avatarSection}>
            <View style={S.avatarWrapper}>
              <View style={S.avatarOuter}>
                <Image
                  resizeMode="cover"
                  style={S.avatarImg}
                  source={displayImage()}
                />
                {isUploadingImage && (
                  <View style={S.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#FFF" />
                  </View>
                )}
              </View>
              <Pressable
                style={S.cameraBtn}
                onPress={() =>
                  Alert.alert('Update Photo', 'Choose an option', [
                    { text: '📷  Camera', onPress: openCamera },
                    { text: '🖼  Gallery', onPress: openGallery },
                    {
                      text: '🗑️  Remove Photo',
                      onPress: handleRemovePhoto,
                      style: 'destructive',
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ])
                }
                disabled={isUploadingImage}
              >
                <Image
                  source={require('../../../../assets/image/camera.png')}
                  style={S.cameraIco}
                />
              </Pressable>
            </View>
            {!!name && <Text style={S.avatarName}>{name}</Text>}
            {!!email && <Text style={S.avatarEmail}>{email}</Text>}
            {profileImageUrl && (
              <Pressable style={S.removePhotoBtn} onPress={handleRemovePhoto}>
                <Text style={S.removePhotoTxt}>Remove Photo</Text>
              </Pressable>
            )}
          </View>

          {/* ── Personal Info ── */}
          <Text style={S.sectionLabel}>Personal Info</Text>
          <View style={S.card}>
            <FieldRow
              icon="👤"
              label="Full Name"
              value={name}
              editable={false}
            />
            <FieldRow
              icon="✉️"
              label="Email Address"
              value={email}
              editable={false}
              isLast
            />
          </View>

          <View style={S.card}>
            <FieldRow
              icon="🎂"
              label="Age Range"
              required
              value={age}
              placeholder="Select age range"
              isSelect
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => setAgeModal(true), 150);
              }}
            />
            <FieldRow
              icon="🌍"
              label="Country"
              required
              value={country}
              placeholder="Select your country"
              isSelect
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => setCountryModal(true), 150);
              }}
            />
            <FieldRow
              icon="🏙️"
              label="City"
              required
              value={city}
              onChangeText={setCity}
              placeholder="Enter your city"
              isLast
            />
          </View>

          {/* ── Budget Preferences ── */}
          <Text style={S.sectionLabel}>Budget Preferences</Text>
          <View style={S.card}>
            <FieldRow
              icon="💰"
              label="Budget Range"
              required
              value={budgetSelect}
              placeholder="Select budget preference"
              isSelect
              isLast
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => setBudgetModal(true), 150);
              }}
            />
          </View>

          {/* ── Other Preferences ── */}
          <Text style={S.sectionLabel}>Other Preferences</Text>
          <TouchableOpacity
            style={S.toggleCard}
            activeOpacity={0.8}
            onPress={() => setHasDogs(p => !p)}
          >
            <View style={S.iconBox}>
              <Text style={S.iconTxt}>🐕</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.toggleLbl}>I have dogs</Text>
              <Text style={S.toggleSub}>
                We'll find pet-friendly venues for you
              </Text>
            </View>
            <View
              style={[
                S.track,
                { backgroundColor: hasDogs ? COLORS.primary : COLORS.border },
              ]}
            >
              <View
                style={[
                  S.thumb,
                  { transform: [{ translateX: hasDogs ? 21 : 0 }] },
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* ── Add Interest Section ── */}
          <Text style={S.sectionLabel}>Add Interest</Text>
          <View style={S.card}>
            <FieldRow
              icon="⭐"
              label="Your Interests"
              value={getInterestDisplay()}
              placeholder="Select your interests"
              isSelect
              isLast
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => setInterestModalVisible(true), 150);
              }}
              pointerEvents="none"
            />
          </View>
        </ScrollView>

        {/* ── Save Button ── */}
        <View style={S.bottomBar}>
          <Pressable style={S.saveBtn} onPress={handleSave}>
            <Text style={S.saveTxt}>Save Changes</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* ── Age Modal ── */}
      <PickerModal
        visible={ageModal}
        title="Select Age Range"
        options={AGE_OPTIONS}
        selected={age}
        onSelect={v => {
          setAge(v);
          setAgeModal(false);
        }}
        onClose={() => setAgeModal(false)}
      />

      {/* ── Budget Modal ── */}
      <PickerModal
        visible={budgetModal}
        title="Select Budget Preference"
        options={BUDGET_OPTIONS}
        selected={budgetSelect}
        onSelect={v => {
          setBudgetSelect(v);
          setBudgetModal(false);
        }}
        onClose={() => setBudgetModal(false)}
      />

      {/* ── Country Modal ── */}
      <PickerModal
        visible={countryModal}
        title="Select Country"
        options={COUNTRIES}
        selected={country}
        searchable
        onSelect={v => {
          setCountry(v);
          setCountryModal(false);
        }}
        onClose={() => setCountryModal(false)}
      />

      {/* ── Interest Modal ── */}
      <InterestModal
        visible={interestModalVisible}
        allInterests={allInterests}
        selectedIds={selectedInterestIds}
        disabledIds={disabledInterestIds}
        onConfirm={handleConfirmInterests}
        onClose={() => setInterestModalVisible(false)}
      />
    </SafeAreaView>
  );
}