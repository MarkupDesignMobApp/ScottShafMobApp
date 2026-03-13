import { StyleSheet } from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  /* ---------------- HEADER ---------------- */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingHorizontal: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(1.8),
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
    paddingVertical: responsiveScreenHeight(1.3),
    alignItems: 'center',
  },

  createButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-SemiBold',
    fontSize: responsiveScreenFontSize(1.85),
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
