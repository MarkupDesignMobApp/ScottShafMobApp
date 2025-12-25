import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../../components/ui/AppButton/AppButton';
import Share from 'react-native-share'
const THUMB_WIDTH = 70;
const THUMB_MARGIN = 12;

export default function OfferDetail({navigation}) {
  const [isCentered, setIsCentered] = React.useState(true);
  const shareContent = async () => {
    const options={
      message:"This is a trst message"
    }
    try {
      const res = await Share.open(options);
      console.log(res);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  };
  
  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Image
              source={require('../../../../assets/image/left-icon.png')}
              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Offer Details</Text>
          <TouchableOpacity onPress={shareContent}>
            <Image
              source={require('../../../../assets/image/next.png')}
              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
        </View>

        {/* Main Image */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
          }}
          style={styles.mainImage}
        />

        <View style={styles.thumbWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbRow}
          >
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <Image
                key={i}
                source={{
                  uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
                }}
                style={styles.thumb}
              />
            ))}
          </ScrollView>
        </View>

        {/* Content Card */}
        <View style={styles.card}>
          <ScrollView style={{ maxHeight: 350 }}>
            <View style={styles.brandRow}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
                }}
                style={styles.brandLogo}
              />
              <View>
                <Text style={styles.brandName}>Brand Name Coffee Co.</Text>
                <Text style={styles.verified}>Verified Partner</Text>
              </View>
            </View>

            <Text style={styles.offerTitle}>20% Off Your Next Coffee</Text>
            <Text style={styles.offerDesc}>
              Enjoy a special discount on your favorite coffee drinks. Valid for
              all sizes and customizations.
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Image
                  source={require('../../../../assets/image/calendar.png')}
                  style={{ width: 22, height: 22 }}
                />

                <Text style={styles.infoText}>Valid until Dec 31, 2025</Text>
              </View>
              <View style={styles.infoItem}>
                <Image
                  source={require('../../../../assets/image/multiple.png')}
                  style={{ width: 22, height: 22 }}
                />

                <Text style={styles.infoText}>1,234 claimed</Text>
              </View>
            </View>

            {/* Promo Code */}
            <View style={styles.promoBox}>
              <Text style={styles.promoLabel}>YOUR PROMO CODE</Text>
              <View style={styles.promoRow}>
                <Text style={styles.promoCode}>COFFEE227</Text>
                <TouchableOpacity style={styles.copyBtn}>
                  <Text style={styles.copyText}>Copy Code</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* How to Redeem */}
            <View style={styles.redeemBox}>
              <Text style={styles.redeemTitle}>How to Redeem</Text>
              {[
                'Visit any participating Brand Name location',
                'Show this code at check out',
                'Enjoy your discounted coffee!',
              ].map((item, i) => (
                <View key={i} style={styles.redeemRow}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.redeemText}>{item}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Redeem Button */}
        <AppButton title='Redeem Offer'/>
        {/* <TouchableOpacity style={styles.redeemBtn}>
          <Text style={styles.redeemBtnText}>Redeem Offer</Text>
        </TouchableOpacity> */}

        <View style={{ height: 30 }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#000', fontSize: 16, fontWeight: '400' },

  mainImage: { width: '100%', height: 260 },

  thumbWrapper: {
    width: '100%',
    alignItems: 'center', // ✅ centers content safely
    marginTop: -80,
  },

  thumbRow: {
    flexDirection: 'row',
  },

  thumb: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginHorizontal: 7, // spacing between images
  },
  // thumb: { width: '30%', height: 70, borderRadius: 10, borderWidth: 1, borderColor: '#E5E5E5' },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 18,
    padding: 16,
    marginTop: 30,
  },

  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  brandLogo: { width: 44, height: 44, borderRadius: 10, marginRight: 10 },
  brandName: { fontSize: 14, fontWeight: '600' },
  verified: { fontSize: 11, color: '#2563EB' },

  offerTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  offerDesc: { fontSize: 12, color: '#64748B', marginBottom: 10 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 11, color: '#64748B', marginLeft: 4 },

  promoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  promoLabel: { fontSize: 10, color: '#64748B', marginBottom: 6 },
  promoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoCode: { fontSize: 20, fontWeight: '700', letterSpacing: 1 },
  copyBtn: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  copyText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },

  redeemBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
  },
  redeemTitle: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  redeemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  redeemText: { fontSize: 12, flex: 1 },

  redeemBtn: {
    marginHorizontal: 16,
    backgroundColor: '#2563EB',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  redeemBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
