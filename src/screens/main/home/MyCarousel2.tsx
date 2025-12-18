import * as React from 'react';
import { FlatList, View, Text, Image } from 'react-native';
import { carouselData } from './dummydata';
import { styles } from './styles';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

type ItemType = {
  id: string;
  title: string;
  image: string;
};
type OptimizedFlatListProps = {
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
};
export default function OptimizedFlatList2({
  ListHeaderComponent,
  ListFooterComponent,
}: OptimizedFlatListProps) {
  /** API-ready state */
  const [data, setData] = React.useState<ItemType[]>([]);
  const [loading, setLoading] = React.useState(false);

  /** Simulate API response (replace later) */
  React.useEffect(() => {
    setLoading(true);

    // Simulating API call
    const timer = setTimeout(() => {
      setData(carouselData);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  /** Memoized renderItem */
  const renderItem = React.useCallback(
    ({ item }: { item: ItemType }) => <Row item={item} />,
    [],
  );

  /** Stable key */
  const keyExtractor = React.useCallback((item: ItemType) => item.id, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      /** Header & Footer from props */
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      /** 🔥 Performance */
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
      updateCellsBatchingPeriod={50}
      scrollEventThrottle={16}
    />
  );
}

/** Memoized row (UI placeholder only) */
const Row = React.memo(({ item }: { item: ItemType }) => {
  return (
    <View style={styles.card2}>
      <View style={styles.cardimgcontainer}>
        <Image
          resizeMode="cover"
          style={{ ...styles.img2 }}
          source={require('../../../../assets/image/cofee.png')}
        />
      </View>

      <View style={{ height: '40%' }}>
        <View style={{ paddingHorizontal: responsiveScreenWidth(2) }}>
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
          <View style={{ paddingLeft: '2%' }}>
            <Text style={styles.cardmaintitletxt}>
              Get 20% off your next coffee
            </Text>
            <Text
              style={{
                ...styles.cardsubtitletxt,
                fontSize: responsiveScreenFontSize(1.5),
              }}
            >
              Exclusive offer for Top List members. Valid at participating
              locations.
            </Text>
          </View>
        </View>
      </View>
      {/* <Image source={{ uri: item.image }} />
      <Text>{item.title}</Text> */}
    </View>
  );
});
