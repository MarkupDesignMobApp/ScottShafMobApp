import * as React from 'react';
import { FlatList, View, Text, Image, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { useGetCampaignsQuery } from '../../../features/auth/authApi';

/* ---------------- PROPS ---------------- */
type OptimizedFlatListProps = {
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
};

/* ---------------- MAIN LIST ---------------- */
export default function OptimizedFlatList2({
  ListHeaderComponent,
  ListFooterComponent,
}: OptimizedFlatListProps) {
  const { data, isLoading } = useGetCampaignsQuery();

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => <Row item={item} />,
    [],
  );

  const keyExtractor = React.useCallback((item: any) => item.id.toString(), []);

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <FlatList
      data={data ?? []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
      updateCellsBatchingPeriod={50}
      scrollEventThrottle={16}
    />
  );
}

/* ---------------- ROW ---------------- */

const FALLBACK_IMAGE = require('../../../../assets/image/cofee.png');

const Row = React.memo(({ item }: { item: any }) => {
  const [imageError, setImageError] = React.useState(false);

  const imageSource =
    item?.image_url && !imageError
      ? { uri: `https://www.markupdesigns.net/scott-shafer/${item.image_url}` }
      : FALLBACK_IMAGE;

  return (
    <View style={styles.card2}>
      {/* IMAGE */}
      <View style={styles.cardimgcontainer}>
        <Image
          resizeMode="cover"
          style={styles.img2}
          source={imageSource}
          onError={() => setImageError(true)}
        />
      </View>

      {/* CONTENT */}
      <View style={{ height: '40%' }}>
        <View style={{ paddingHorizontal: responsiveScreenWidth(2) }}>
          {/* SPONSORED BADGE (STATIC) */}
          <View
            style={{
              paddingVertical: responsiveScreenHeight(0.75),
              backgroundColor: '#00C4FA',
              width: responsiveScreenWidth(25),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: responsiveScreenWidth(20),
              marginVertical: 10,
            }}
          >
            <Text>Sponsored</Text>
          </View>

          {/* TITLE */}
          <View style={{ paddingLeft: '2%' }}>
            <Text style={styles.cardmaintitletxt} numberOfLines={2}>
              {item?.title ?? ''}
            </Text>

            {/* SUBTITLE */}
            <Text
              style={{
                ...styles.cardsubtitletxt,
                fontSize: responsiveScreenFontSize(1.5),
              }}
              numberOfLines={3}
            >
              {item?.subtitle ?? ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});
