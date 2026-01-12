import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#0A7AFF',
  lightBlue: '#E8F5FF',
  border: '#E0E0E0',
  cardBorder: '#B8E0FF',
  text: '#000000',
  muted: '#999999',
  background: '#F5F5F5',
  white: '#FFFFFF',
  successBg: '#00D4D4',
  cardbg: '#DBEDFF',
  Circle: '#00C4FA',
  cardborder: '#A8A8A8',
  Iconbg: '#E3F9FF'
};

export default function InviteScreen({ navigation }) {
  const [title, setTitle] = useState('Top 3 Pizza Place in NY');
  const [items, setItems] = useState([
    { id: 1, text: "Joe's Pizza" },
    { id: 2, text: "Scarr's Pizza" },
    { id: 3, text: '' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateItem = (id, value) => {
    setItems(list => list.map(i => (i.id === id ? { ...i, text: value } : i)));
  };

  const removeItem = id => {
    setItems(list => list.filter(i => i.id !== id));
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <View style={styles.indexCircle}>
        <Text style={styles.indexText}>
          {String(index + 1).padStart(2, '0')}
        </Text>
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          value={item.text}
          onChangeText={t => updateItem(item.id, t)}
          placeholder={`Item ${index + 1}`}
          placeholderTextColor="#CCCCCC"
          style={styles.input}
        />

        {item.text.length === 0 && (
          <View style={styles.iconGroup}>
            <Image
              source={require('../../../../assets/image/clipboard.png')}
              style={styles.iconImage}
              accessibilityLabel="attach-photo"
            />
            <Image
              source={require('../../../../assets/image/close.png')}
              style={styles.iconImage}
              accessibilityLabel="remove-item"
            />
          </View>
        )}

        {/* when has text show clear (close) button as image */}
        {item.text.length > 0 && (
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Image
              source={require('../../../../assets/image/close.png')}
              style={styles.clearImage}
              accessibilityLabel="remove-item"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Image
              source={require('../../../../assets/image/left-icon.png')}
              style={styles.backImage}
              accessibilityLabel="back"
            />
          </TouchableOpacity>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <View style={styles.cardTopBar}>
            <Text style={styles.cardHeader}>New List</Text>
            <TouchableOpacity>
              <Image
                source={require('../../../../assets/image/dots.png')}
                style={styles.menuImage}
                accessibilityLabel="menu"
              />
            </TouchableOpacity>
          </View>


          <Text style={styles.label}>List Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />

          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />

          <TouchableOpacity
            style={styles.publishBtn}
            onPress={() => navigation.navigate('Publish')}>
            <Text style={styles.publishText}>Publish List</Text>
          </TouchableOpacity>
        </View>

        {/* SUCCESS MODAL */}
        <Modal visible={showSuccess} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.successCard}>
              {/* SUCCESS badge on top border */}
              <View style={styles.successBadge}>
                <Text style={styles.successText}>SUCCESS!</Text>
              </View>

              <View style={styles.iconCircle}>
                <Image
                  source={require('../../../../assets/image/usersmul.png')}
                  style={styles.peopleImage}
                />
              </View>

              <Text style={styles.inviteTitle}>Invite Friends?</Text>
              <Text style={styles.inviteDesc}>
                Lists are better with friends. Invite 2 friends to unlock the
                'community Badge'
              </Text>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <View style={styles.iconBg}>
                    <Image
                      source={require('../../../../assets/image/whatsapp.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                  <Text style={styles.socialText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialBtn}>
                  <View style={styles.iconBg}>
                    <Image
                      source={require('../../../../assets/image/mail.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                  <Text style={styles.socialText}>SMS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialBtn}>
                  <View style={styles.iconBg}>
                    <Image
                      source={require('../../../../assets/image/chain.png')}
                      style={styles.socialIconImage}
                    />
                  </View>
                  <Text style={styles.socialText}>Copy Link</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setShowSuccess(false)}>
                <Text style={styles.skip}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  backImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardborder,
    marginBottom: 20,
  },

  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardbg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: -16,
    marginTop: -16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 16,
  },


  cardHeader: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily:'Quicksand-bold'
  },
  menuImage: {
    width: 20,
    height: 20,
    tintColor: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },

  label: {
    color: COLORS.text,
    marginBottom: 6,
    fontSize: 13,
    fontFamily:'Quicksand-Regular'
  },
  titleInput: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  indexCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.Circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    fontFamily:'Quicksand-Regular'
  },
  indexText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    fontFamily:'Quicksand-Medium'
  },

  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#00C4FA',
      fontFamily:'Quicksand-Medium'
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginLeft: 8,
    tintColor: COLORS.muted,
  },
  clearImage: {
    width: 10,
    height: 10,
    marginLeft: 8,
    tintColor: COLORS.muted,
  },

  publishBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  publishText: {
    color: COLORS.white,
    fontWeight: '400',
     fontFamily:'Quicksand-Regular',
    fontSize: 18,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    paddingTop: 36,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },

  successBadge: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 4,
  },

  successText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.Iconbg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  socialIconImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },


  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.Iconbg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  peopleImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },

  inviteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
     fontFamily:'Quicksand-Bold'
  },
  inviteDesc: {
    textAlign: 'center',

    marginBottom: 20,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 10,
     fontFamily:'Quicksand-medium'
  },

  socialRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  socialBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',

    minWidth: 80,
  },
 
  socialText: {
    fontSize: 11,
    color: COLORS.text,
  },
  skip: {
    color: COLORS.muted,
    fontSize: 14,
     fontFamily:'Quicksand-medium'
  },
});
