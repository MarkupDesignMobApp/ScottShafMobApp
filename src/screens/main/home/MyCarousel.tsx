import * as React from 'react';
import { FlatList, View, Image, Text } from 'react-native';
import { styles } from './styles';
import { useGetFeaturedListsQuery } from '../../../features/auth/authApi';
import { FeaturedListSummary } from '../../../features/auth/authTypes';
import Loader from '../../../components/ui/Loader/Loader';

type OptimizedFlatListProps = {
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  interestId: number | null; // null = For You
};

export default function OptimizedFlatList({
  ListHeaderComponent,
  ListFooterComponent,
  interestId,
}: OptimizedFlatListProps) {
  /**
   * ✅ RTK Query
   * - null → /featured-lists
   * - number → /featured-lists?interest_id=x
   */
  const {
    data = [],
    isLoading,
    isFetching,
  } = useGetFeaturedListsQuery(interestId ? { interestId } : undefined);

  /**
   * ✅ Stable renderItem
   */
  const renderItem = React.useCallback(
    ({ item }: { item: FeaturedListSummary }) => <Row item={item} />,
    [],
  );

  /**
   * ✅ Stable key extractor
   */
  const keyExtractor = React.useCallback(
    (item: FeaturedListSummary) => item.id.toString(),
    [],
  );

  return (
    <View>
      {(isLoading || isFetching) && <Loader visible />}

      <FlatList
        data={data}
        horizontal
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        extraData={interestId} // 🔑 re-render on tab change
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

/* ---------------- ROW ITEM ---------------- */

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

            {/* ✅ CORRECT DATA ACCESS */}
            <Text style={styles.cardsubtitletxt}>
              {item.category?.name} · {item.interest?.name}
            </Text>
          </View>
        </View>

        <View style={styles.cardlike}>
          <Like
            icon={require('../../../../assets/image/heart.png')}
            value="355k"
          />
          <Like
            icon={require('../../../../assets/image/bookmark.png')}
            value="89"
          />
          <Like
            icon={require('../../../../assets/image/share.png')}
            value="15"
          />
        </View>
      </View>
    </View>
  );
});

/* ---------------- LIKE ITEM ---------------- */

const Like = React.memo(({ icon, value }: { icon: any; value: string }) => (
  <View style={styles.likecontainer}>
    <View style={styles.imgcontainer3}>
      <Image resizeMode="contain" style={styles.img} source={icon} />
    </View>
    <Text style={styles.liketxt}>{value}</Text>
  </View>
));
