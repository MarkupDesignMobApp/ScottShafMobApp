import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

interface ModalLoaderProps {
  visible: boolean;
  color?: string;
  size?: 'small' | 'large';
  backgroundOpacity?: number;
}

const Loader: React.FC<ModalLoaderProps> = ({
  visible,
  color = '#fff',
  size = 'large',
  backgroundOpacity = 0.5,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(0,0,0,${backgroundOpacity})` },
        ]}
      >
        <ActivityIndicator size={size} color={color} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
