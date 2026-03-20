import React from 'react';
import { View, StatusBar, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import Recommend from './Recommend';

export default function Recommend_Screen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* STATUS BAR */}


        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Recommended For You</Text>
        </View>
        <StatusBar barStyle="dark-content" backgroundColor="#2C3E50" translucent />
        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentCard}>
            <Recommend />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FB', // screen background
  },

  /* ================= HEADER ================= */
  headerContainer: {
    backgroundColor: '#2C3E50', // theme color as main header
    paddingTop: responsiveScreenHeight(3), // for status bar
    paddingBottom: responsiveScreenHeight(2),
    paddingHorizontal: responsiveScreenWidth(5),

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: responsiveScreenFontSize(2),
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  /* ================= CONTENT ================= */
  contentContainer: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingTop: responsiveScreenHeight(3),
    paddingBottom: responsiveScreenHeight(4),
  },

  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveScreenWidth(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
