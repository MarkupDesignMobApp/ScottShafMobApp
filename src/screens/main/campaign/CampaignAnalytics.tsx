import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



export default function CampaignAnalytics() {

  const segmentPerformance = [
    {
      id: 1,
      label: "Coffee",
      value: "42%",
      dotStyle: styles.legendDotPink,
    },
    {
      id: 2,
      label: "Food & Drinks",
      value: "31%",
      dotStyle: styles.legendDotBlue,
    },
    {
      id: 3,
      label: "Local Explorers",
      value: "27%",
      dotStyle: styles.legendDotGreen,
    },
  ];

  const statsCards = [
    {
      id: 1,
      label: "Impressions",
      value: "12,457",
      sub: "+23% vs last week",
      borderStyle: styles.blueBorder,
    },
    {
      id: 2,
      label: "Clicks",
      value: "3,425",
      sub: "27.5% CTR",
      borderStyle: styles.blueBorder,
    },
    {
      id: 3,
      label: "Claimed",
      value: "1,256",
      sub: "36% conversion",
      borderStyle: styles.pinkBorder,
    },
    {
      id: 4,
      label: "Redeemed",
      value: "855",
      sub: "71% redemption",
      borderStyle: styles.greenBorder,
    },
  ];




  return (
    <SafeAreaProvider >
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        <View style={styles.header}>
          <TouchableOpacity>
            <Image source={require('../../../../assets/image/left-icon.png')} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campaign Analytics</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Location */}
        <Text style={styles.subTitle}>Nearby Location</Text>
        <Text style={styles.brandText}>Brand Name Coffee – 20% Off</Text>

        {/* Stats Cards */}
        <View style={styles.statsWrapper}>
          {statsCards.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.card,
                item.borderStyle,
                index % 2 === 0 && styles.cardMarginRight,
              ]}
            >
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </View>
          ))}
        </View>

        {/* Engagement */}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Engagement Over Time</Text>
          <View style={styles.chartRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <View key={day} style={styles.chartItem}>
                <View
                  style={[
                    styles.bar,
                    { height: i === 2 ? 70 : 45 + i * 2, backgroundColor: i === 2 ? '#3B82F6' : '#C7D2FE' },
                  ]}
                />
                <Text style={styles.chartLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Segment Performance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Segment Performance</Text>

          {segmentPerformance.map(item => (
            <View key={item.id} style={styles.legendRow}>
              <View style={item.dotStyle} />
              <Text style={styles.legendText}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {segmentPerformance.map(item => (
            <View key={item.id} style={styles.legendRow}>
              <View style={item.dotStyle} />
              <Text style={styles.legendText}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  subTitle: { fontSize: 12, color: '#64748B' },
  brandText: { fontSize: 14, fontWeight: '500', marginBottom: 16 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,            // thicker rounded look
    padding: 18,                 // more padding
    marginBottom: 16,
    borderWidth: 1,             // 🔥 THICK BORDER
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardMarginRight: {
    marginRight: "4%",
  },

  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7A7A7A",
    marginBottom: 6,
  },

  cardValue: {
    fontSize: 26,                // 🔥 BIG & THICK
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },

  cardSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },

  blueBorder: {
    borderColor: "#3B82F6",
  },

  pinkBorder: {
    borderColor: "#EC4899",
  },

  greenBorder: {
    borderColor: "#22C55E",
  },

  // cardLabel: { fontSize: 12, color: '#64748B' },
  // cardValue: { fontSize: 20, fontWeight: '700', marginVertical: 4 },
  // cardSub: { fontSize: 11, color: '#64748B' },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 10 },

  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  chartItem: { alignItems: 'center', width: '13%' },
  bar: { width: 14, borderRadius: 6 },
  chartLabel: { fontSize: 10, marginTop: 4, color: '#64748B' },

  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendText: { flex: 1, fontSize: 12 },
  legendValue: { fontSize: 12, fontWeight: '600' },

  legendDotPink: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EC4899', marginRight: 8 },
  legendDotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 8 },
  legendDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 8 },
});
