import * as React from 'react';
import { FlatList, View, Text, Image } from 'react-native';

import { carouselData } from './dummydata';
import { styles } from './styles';

type ItemType = {
  id: string;
  title: string;
  image: string;
};

type OptimizedFlatListProps = {
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
};

export default function OptimizedFlatList3({
  ListHeaderComponent,
  ListFooterComponent,
}: OptimizedFlatListProps) {

  const [data, setData] = React.useState<ItemType[]>([]);
  const [loading, setLoading] = React.useState(false);

  /* Simulate API */
  React.useEffect(() => {

    setLoading(true);

    const timer = setTimeout(() => {
      setData(carouselData);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);

  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: ItemType }) => <Row item={item} />,
    [],
  );

  const keyExtractor = React.useCallback(
    (item: ItemType) => item.id,
    [],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}

      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

/* ---------------- ROW CARD ---------------- */

const Row = React.memo(({ item }: { item: ItemType }) => {

  const imageSource = item?.image
    ? { uri: item.image }
    : require('../../../../assets/image/cofee.png');

  return (

    <View style={styles.carouselCard}>

      {/* IMAGE */}

      <Image
        source={imageSource}
        style={styles.carouselImage}
        resizeMode="cover"
      />

      {/* CONTENT */}

      <View style={styles.carouselContent}>

        {/* BADGE */}

        <View style={styles.sponsoredBadge}>
          <Text style={styles.sponsoredText}>Sponsored</Text>
        </View>

        {/* TITLE */}

        <Text
          style={styles.carouselTitle}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* DESCRIPTION */}

        <Text
          style={styles.carouselSubtitle}
          numberOfLines={3}
        >
          Exclusive offer for Top List members. Valid at participating locations.
        </Text>

      </View>

    </View>

  );

});