import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

interface Props {
  dataLength: number;
  activeIndex: number;
}

const Pagination: React.FC<Props> = ({ dataLength, activeIndex }) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: dataLength }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            activeIndex === index ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

export default Pagination;
