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
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import AppHeader from '../../../components/ui/AppButton/AppHeader';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useGetUserProfileQuery } from '../../../features/auth/authApi';
import Loader from '../../../components/ui/Loader/Loader';
import { useFocusEffect } from '@react-navigation/native';

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
  scrollContent: {
    paddingHorizontal: responsiveScreenWidth(5),
    paddingBottom: responsiveScreenHeight(16),
    paddingTop: responsiveScreenHeight(1.5),
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: responsiveScreenHeight(2.5),
  },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
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
  avatarName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
    letterSpacing: -0.3,
  },
  avatarEmail: {
    fontSize: responsiveFontSize(1.65),
    color: COLORS.textMuted,
    marginTop: 3,
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
});

/* ─────────────── PICKER MODAL ─────────────── */
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

  // Reset search when modal closes
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
        <Pressable style={S.sheet} onPress={() => {}}>
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
}: FieldRowProps) => {
  const inner = (
    <View style={[S.row, isLast && S.rowLast]}>
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
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // existing URL from API
  const [newProfileImage, setNewProfileImage] = useState<any>(null); // newly picked from camera/gallery

  const [ageModal, setAgeModal] = useState(false);
  const [budgetModal, setBudgetModal] = useState(false);
  const [countryModal, setCountryModal] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  // ✅ FIX: Track whether we've already populated fields from API.
  // Without this, RTK Query re-fetches after save (due to invalidatesTags
  // removed from authApi — but other tags could still trigger it),
  // and the useEffect would overwrite the user's edited values.
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
    refetch,
  } = useGetUserProfileQuery();

  useFocusEffect(
    useCallback(() => {
      setTimeout(
        () => scrollRef.current?.scrollTo({ y: 0, animated: true }),
        100,
      );
      // Reset on blur so re-entering screen loads fresh data
      return () => {
        initialized.current = false;
      };
    }, []),
  );

  useEffect(() => {
    if (initialized.current) return;
    if (profileResponse?.success) {
      initialized.current = true;
      const u = profileResponse.data.user;

      setName(u.full_name ?? '');
      setEmail(u.email ?? '');
      setCountry(u.country ?? ''); // ✅ top-level on user
      setCity(u.profile?.city ?? ''); // ✅ inside user.profile
      setAge(u.profile?.age_band ?? '');
      setBudgetSelect(u.profile?.dining_budget ?? '');
      setBudgetDesc(u.profile?.budget_description ?? '');
      setHasDogs(u.profile?.has_dogs === 1 || u.profile?.has_dogs === '1');
      setProfileImageUrl(u.profile?.profile_image ?? null); // only load URL from API once
    }
  }, [profileResponse]);

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

  const openCamera = async () => {
    if (!(await requestCameraPermission())) return;

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.7,
        includeBase64: false,
      },
      response => {
        if (response.didCancel || response.errorCode) return;

        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        setNewProfileImage({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `camera_${Date.now()}.jpg`,
        });
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.didCancel || response.errorCode) return;

        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        setNewProfileImage({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `gallery_${Date.now()}.jpg`,
        });
      },
    );
  };

  const handleBudgetDescChange = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= MAX_WORDS || text.length < budgetDesc.length)
      setBudgetDesc(text);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const fd = new FormData();

      fd.append('full_name', name || '');
      fd.append('age_band', age || '');
      fd.append('city', city || '');
      fd.append('dining_budget', budgetSelect || budgetDesc || '');
      fd.append('has_dogs', hasDogs ? '1' : '0');
      fd.append('country', country || '');

      if (newProfileImage?.uri) {
        fd.append('profile_image', {
          uri:
            Platform.OS === 'android'
              ? newProfileImage.uri
              : newProfileImage.uri.replace('file://', ''),
          type: newProfileImage.type || 'image/jpeg',
          name: newProfileImage.name || `profile_${Date.now()}.jpg`,
        } as any);
      }

      const response = await fetch(
        'https://www.markupdesigns.net/scott-shafer/api/update_profile',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: fd,
        },
      );

      const res = await response.json();

      if (!response.ok || !res.success) {
        throw new Error(res.message || 'Update failed');
      }

      // ✅ IMPORTANT FIX
      await refetch(); // 👈 THIS LINE FIXES YOUR ISSUE

      navigation.goBack();

      setTimeout(() => {
        Alert.alert('Saved!', res.message || 'Profile updated successfully');
      }, 300);
    } catch (err: any) {
      console.log('❌ Save error:', err);
      Alert.alert('Error', err?.message || 'Update failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = budgetDesc.trim()
    ? budgetDesc.trim().split(/\s+/).length
    : 0;
  const wordPct = Math.min((wordCount / MAX_WORDS) * 100, 100);

  return (
    <View style={S.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <Loader visible={isSaving || profileLoading} />

      <AppHeader
        title="Edit Profile"
        onLeftPress={() => navigation.goBack()}
        leftImage={require('../../../../assets/image/left-icon.png')}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={S.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Avatar ── */}
          <View style={S.avatarSection}>
            <View style={S.avatarWrapper}>
              <View style={S.avatarOuter}>
                <Image
                  resizeMode="cover"
                  style={S.avatarImg}
                  source={
                    newProfileImage
                      ? { uri: newProfileImage.uri } // newly picked
                      : profileImageUrl
                      ? { uri: profileImageUrl } // existing from API
                      : require('../../../../assets/image/nophoto.jpg') // fallback
                  }
                />
              </View>
              <Pressable
                style={S.cameraBtn}
                onPress={() =>
                  Alert.alert('Update Photo', 'Choose an option', [
                    { text: '📷  Camera', onPress: openCamera },
                    { text: '🖼  Gallery', onPress: openGallery },
                    { text: 'Cancel', style: 'cancel' },
                  ])
                }
              >
                <Image
                  source={require('../../../../assets/image/camera.png')}
                  style={S.cameraIco}
                />
              </Pressable>
            </View>
            {!!name && <Text style={S.avatarName}>{name}</Text>}
            {!!email && <Text style={S.avatarEmail}>{email}</Text>}
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
            {/* ✅ Country ABOVE City */}
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

          {/* ── Dining Preferences ── */}
          <Text style={S.sectionLabel}>Dining Preferences</Text>
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

          <View style={S.taCard}>
            <View style={S.taHeader}>
              <View style={S.taIconBox}>
                <Text style={{ fontSize: 16 }}>📝</Text>
              </View>
              <Text style={S.taLbl}>
                Describe your dining budget<Text style={S.reqDot}> *</Text>
              </Text>
            </View>
            <TextInput
              value={budgetDesc}
              onChangeText={handleBudgetDescChange}
              multiline
              textAlignVertical="top"
              placeholder="Tell us about your dining preferences and budget expectations..."
              placeholderTextColor={COLORS.textMuted}
              style={S.taInput}
            />
            <View style={S.wcRow}>
              <View style={S.wcTrack}>
                <View
                  style={[
                    S.wcFill,
                    {
                      width: `${wordPct}%`,
                      backgroundColor:
                        wordCount > 180 ? COLORS.error : COLORS.primary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[S.wcTxt, wordCount > 180 && { color: COLORS.error }]}
              >
                {wordCount}/{MAX_WORDS}
              </Text>
            </View>
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
    </View>
  );
}
