import { StyleSheet } from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  /* ---------------- HEADER ---------------- */
  // Add these new styles for centered onboarding

  emojiIcon: {
    fontSize: responsiveScreenFontSize(8),
    marginBottom: responsiveScreenHeight(2),
    textAlign: 'center',
  },

  // Update these styles in your styles.ts
  onboardingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
   overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2C3E50',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#00C4FA',
    width: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  skipText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#00C4FA',
  },
  nextText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredTooltip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: responsiveScreenWidth(6),
    width: responsiveScreenWidth(85),
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  centeredTitle: {
    fontSize: responsiveScreenFontSize(2.5),
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: responsiveScreenHeight(1),
    lineHeight: responsiveScreenFontSize(3.2),
  },
  centeredDescription: {
    fontSize: responsiveScreenFontSize(1.6),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: responsiveScreenFontSize(2.2),
    marginBottom: responsiveScreenHeight(2.5),
    paddingHorizontal: responsiveScreenWidth(2),
  },
  centeredProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(2.5),
  },
  centeredProgressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 6,
  },
  centeredProgressDotActive: {
    width: 24,
    backgroundColor: '#00C4FA',
  },
  centeredButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: responsiveScreenWidth(4),
  },
  centeredSkipButton: {
    flex: 1,
    paddingVertical: responsiveScreenHeight(1.2),
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  centeredSkipButtonText: {
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: '600',
    color: '#6B7280',
  },
  centeredNextButton: {
    flex: 1,
    paddingVertical: responsiveScreenHeight(1.2),
    borderRadius: 40,
    backgroundColor: '#00C4FA',
    alignItems: 'center',
    shadowColor: '#00C4FA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  centeredNextButtonText: {
    fontSize: responsiveScreenFontSize(1.6),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1.8),
  },
  loadingInterests: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1),
  },
  loadingText: {
    marginLeft: responsiveScreenWidth(2),
    fontSize: responsiveScreenFontSize(1.4),
    color: '#6B7280',
  },
  emptyInterests: {
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1),
  },
  emptyInterestsText: {
    fontSize: responsiveScreenFontSize(1.4),
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  profileContainer: {
    width: responsiveScreenWidth(10),
    height: responsiveScreenWidth(10),
    borderRadius: responsiveScreenWidth(5),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF30',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  logo: {
    width: responsiveScreenWidth(12),
    height: responsiveScreenWidth(12),
    tintColor: '#FFFFFF',
  },

  notificationButton: {
    width: responsiveScreenWidth(9),
    height: responsiveScreenWidth(9),
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationIcon: {
    width: '70%',
    height: '70%',
    tintColor: '#FFFFFF',
  },

  /* ---------------- MAIN ---------------- */

  innercontainer: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },

  /* ---------------- TOP SECTION ---------------- */

  topSection: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingBottom: responsiveScreenHeight(2.8),
  },

  /* ---------------- INTEREST PILLS ---------------- */

  interestScroll: {
    flexDirection: 'row',
    marginTop: responsiveScreenHeight(2),
  },
  /// Add these to your existing styles object
  seeAllCard: {
    width: responsiveScreenWidth(60),
    height: responsiveScreenWidth(75),
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed' as const,
  },
  seeAllCardText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#00C4FA',
    marginBottom: 8,
  },
  seeAllCardSubtext: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Ubuntu-Regular',
  },
  loadingContainer: {
    height: responsiveScreenWidth(75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestPill: {
    paddingHorizontal: responsiveScreenWidth(4.2),
    paddingVertical: responsiveScreenHeight(0.9),
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF35',
    marginRight: responsiveScreenWidth(2.5),
  },

  activeInterestPill: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },

  interestText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
    fontSize: responsiveScreenFontSize(1.75),
  },

  activeInterestText: {
    fontFamily: 'Quicksand-Bold',
  },

  /* ---------------- CONTENT ---------------- */

  contentContainer: {
    flex: 1,
    paddingHorizontal: responsiveScreenWidth(4),
  },

  scrollContainer: {
    paddingTop: responsiveScreenHeight(2),
    paddingBottom: responsiveScreenHeight(4),
  },

  /* ---------------- CREATE CARD ---------------- */

  createCard: {
    backgroundColor: '#3498DB',
    borderRadius: 20,
    padding: responsiveScreenWidth(5),

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  createTitle: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-SemiBold',
    fontSize: responsiveScreenFontSize(2.3),
  },

  createSubtitle: {
    color: '#EAF6FF',
    fontFamily: 'Quicksand-Regular',
    fontSize: responsiveScreenFontSize(1.7),
    marginTop: responsiveScreenHeight(0.6),
    lineHeight: responsiveScreenFontSize(2.4),
  },

  createButton: {
    marginTop: responsiveScreenHeight(2),
    backgroundColor: '#1F2E3D',
    borderRadius: 14,
    paddingVertical: responsiveScreenHeight(0),
    alignItems: 'center',
  },

  createButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-SemiBold',
    fontSize: responsiveScreenFontSize(1.5),
  },

  /* ---------------- SECTION HEADINGS ---------------- */

  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(3),
    marginBottom: responsiveScreenHeight(1.8),
  },

  headingText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: responsiveScreenFontSize(2.35),
    color: '#2C3E50',
  },

  seeAll: {
    color: '#3498DB',
    fontFamily: 'Quicksand-SemiBold',
    fontSize: responsiveScreenFontSize(1.75),
  },

  /* ---------------- CAMPAIGN LIST ---------------- */

  campaignList: {
    paddingRight: responsiveScreenWidth(4),
  },

  loaderContainer: {
    marginTop: 30,
    alignItems: 'center',
  },

  /* ---------------- CAMPAIGN CARD ---------------- */

  campaignCard: {
    width: 260,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },

  campaignImage: {
    width: '100%',
    height: 155,
  },

  campaignContent: {
    padding: 16,
  },

  /* ---------------- BADGE ---------------- */

  sponsoredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  sponsoredText: {
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
    color: '#3498DB',
  },

  /* ---------------- TEXT ---------------- */

  campaignTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
  },

  campaignSubtitle: {
    fontSize: 13,
    fontFamily: 'Quicksand-Regular',
    color: '#7F8C8D',
    marginTop: 4,
    lineHeight: 18,
  },

  /* ---------------- CAROUSEL ---------------- */

  carouselContainer: {
    paddingRight: responsiveScreenWidth(4),
  },

  carouselCard: {
    width: 260,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  carouselImage: {
    width: '100%',
    height: 155,
  },

  carouselContent: {
    padding: 16,
  },

  carouselTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
  },

  carouselSubtitle: {
    fontSize: 13,
    fontFamily: 'Quicksand-Regular',
    color: '#7F8C8D',
    marginTop: 4,
    lineHeight: 18,
  },

  /* ---------------- FEATURED CAROUSEL (FIX) ---------------- */
  /* ---------------- FEATURED CAROUSEL ---------------- */

  listContainer: {
    paddingLeft: responsiveScreenWidth(0),
    paddingRight: responsiveScreenWidth(2),
    paddingBottom: 10,
  },

  card: {
    width: responsiveScreenWidth(45),
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  cardImage: {
    width: '100%',
    height: responsiveScreenHeight(18),
  },

  cardBody: {
    padding: responsiveScreenWidth(4),
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  categoryIcon: {
    width: responsiveScreenWidth(7),
    height: responsiveScreenWidth(7),
    marginRight: responsiveScreenWidth(2),
    borderRadius: 6,
  },

  cardTitle: {
    fontSize: responsiveScreenFontSize(1.9),
    fontFamily: 'Quicksand-SemiBold',
    color: '#2C3E50',
  },

  cardSubtitle: {
    fontSize: responsiveScreenFontSize(1.4),
    fontFamily: 'Quicksand-Regular',
    color: '#7F8C8D',
    marginTop: 2,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionIcon: {
    width: responsiveScreenWidth(4.5),
    height: responsiveScreenWidth(4.5),
    marginRight: 4,
  },

  actionText: {
    fontSize: responsiveScreenFontSize(1.4),
    fontFamily: 'Quicksand-Medium',
    color: '#2C3E50',
  },
});
