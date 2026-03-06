import { StyleSheet, View } from 'react-native';
import React from 'react';

import { Text } from '@/components/text';

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Main Screen</Text>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
