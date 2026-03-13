import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../../assets/icons/Backarrow.svg';
import ScanIcon from '../../../assets/icons/Scan.svg';
import ScanIcon2 from '../../../assets/icons/Scan2.svg';

import { Text } from '@/components/text';
import FacialSvg from '../../../assets/images/facial.svg';

const { width, height } = Dimensions.get('window');

export default function FacialAnalysis() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8D5E8', '#E8C5E0', '#D4A5C8', '#C895B8']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Facial Analysis</Text>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <ScanIcon />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Main content - Facial SVG */}
      <View style={styles.content}>
        <View style={styles.facialWrapper}>
          <FacialSvg
            width={width}
            height={height * 0.9}
            preserveAspectRatio="xMidYMid slice"
          />
        </View>

        {/* Detection labels - positioned over the face */}
        <View style={[styles.label, styles.acneLabel]}>
          <Text style={styles.labelText}>Acne Detected</Text>
        </View>
        <View style={[styles.label, styles.rashLabel]}>
          <Text style={styles.labelText}>Skin Rashes Detected</Text>
        </View>
      </View>

      {/* Bottom buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.scanAgainButton}
          activeOpacity={0.85}
        >
          <ScanIcon2 />
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewResultsButton}
          activeOpacity={0.85}
        >
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.viewResultsText}>View Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 10,
    marginBottom: 120,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  facialWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // height: '70%',
  },
  label: {
    position: 'absolute',
    backgroundColor: '#00b3fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  acneLabel: {
    top: '28%',
    left: 24,
  },
  rashLabel: {
    top: '52%',
    right: 24,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
    justifyContent: 'center',
  },
  scanAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FC65D1',
    paddingVertical: 10,
    borderRadius: 12,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewResultsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FC65D1',
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewResultsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
