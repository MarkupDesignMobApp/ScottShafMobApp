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
export default function OptimizedFlatList({
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
    <View style={styles.card}>
      <View style={styles.cardimgcontainer}>
        <Image
          resizeMode="cover"
          style={{ ...styles.img2 }}
          source={{ uri: item.image }}
        />
      </View>

      <View style={{height:'40%',}}>
      <View style={styles.cardtitlecontainer}>
        <View style={styles.imgcontainer4}>
          <Image
            resizeMode="contain"
            style={styles.img}
            source={require('../../../../assets/image/cofeeshop.png')}
          />
        </View>
        <View style={{paddingLeft:'2%'}}>
          <Text style={styles.cardmaintitletxt}>Top 5 Coffee Shops in NYC</Text>
          <Text style={styles.cardsubtitletxt}>By Sarah . Food & Drinks</Text>
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
      {/* <Image source={{ uri: item.image }} />
      <Text>{item.title}</Text> */}
    </View>
  );
});
