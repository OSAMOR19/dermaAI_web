import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

import { Text } from '@/components/text';

const Scanning = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skin Scan</Text>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push('/(screens)/(main screens)/facialanalysis')}
        activeOpacity={0.85}
      >
        <Text style={styles.scanButtonText}>Start Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Scanning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#FC65D1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});