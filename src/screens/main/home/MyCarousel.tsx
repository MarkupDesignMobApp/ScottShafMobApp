import * as React from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { styles } from './styles';
import {
  useGetFeaturedListsQuery,
  useGetFeaturedListsByInterestQuery,
} from '../../../features/auth/authApi';
import { FeaturedListSummary } from '../../../features/auth/authTypes';

type OptimizedFlatListProps = {
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  interestId?: number | null; // optional
};

export default function OptimizedFlatList({
  ListHeaderComponent,
  ListFooterComponent,
  interestId,
}: OptimizedFlatListProps) {
  // ✅ Decide which query to use based on interestId
  const { data: featuredListsForYou, isLoading: loadingForYou } =
    useGetFeaturedListsQuery();
  const { data: featuredListsByInterest, isLoading: loadingByInterest } =
    useGetFeaturedListsByInterestQuery(interestId ?? 0, {
      skip: interestId === null, // skip if no interest selected
    });

  const featuredLists = interestId
    ? featuredListsByInterest
    : featuredListsForYou;
  const isLoading = interestId ? loadingByInterest : loadingForYou;

  const renderItem = React.useCallback(
    ({ item }: { item: FeaturedListSummary }) => <Row item={item} />,
    [],
  );

  const keyExtractor = React.useCallback(
    (item: FeaturedListSummary) => item.id.toString(),
    [],
  );

  return (
    <FlatList
      data={featuredLists ?? []}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
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

const Row = React.memo(({ item }: { item: FeaturedListSummary }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardimgcontainer}>
        <Image
          resizeMode="cover"
          style={styles.img2}
          source={{ uri: item.image }}
        />
      </View>
      <View>
        <View style={styles.cardtitlecontainer}>
          <View style={styles.imgcontainer4}>
            <Image
              resizeMode="contain"
              style={styles.img}
              source={require('../../../../assets/image/cofeeshop.png')}
            />
          </View>
          <View style={{ paddingLeft: '2%' }}>
            <Text style={styles.cardmaintitletxt}>{item.title}</Text>
            <Text style={styles.cardsubtitletxt}>
              {item.category?.name} · {item.category?.interest?.name}
            </Text>
          </View>
        </View>

        <View style={styles.cardlike}>
          <View style={styles.likecontainer}>
            <View style={styles.imgcontainer3}>
              <Image
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/heart.png')}
              />
            </View>
            <Text style={styles.liketxt}>355k</Text>
          </View>

          <View style={styles.likecontainer}>
            <View style={styles.imgcontainer3}>
              <Image
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/bookmark.png')}
              />
            </View>
            <Text style={styles.liketxt}>89</Text>
          </View>

          <View style={styles.likecontainer}>
            <View style={styles.imgcontainer3}>
              <Image
                resizeMode="contain"
                style={styles.img}
                source={require('../../../../assets/image/share.png')}
              />
            </View>
            <Text style={styles.liketxt}>15</Text>
          </View>
        </View>
      </View>
    </View>
  );
});
