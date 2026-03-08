import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../../assets/icons/Backarrow.svg';
import CameraIcon from '../../../assets/icons/Camera.svg';
import Cam from '../../../assets/icons/Cam.svg';
import Phone from '../../../assets/icons/Phone.svg';
import Mic from '../../../assets/icons/Mute.svg';
import { Text } from '@/components/text';
import Speaker from '../../../assets/icons/Speaker.svg';
import CallSvg from '../../../assets/images/Call.svg';

const { width, height } = Dimensions.get('window');

export default function Call() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8D5E8', '#E8C5E0', '#D4A5C8', '#C895B8']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <BackIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <CameraIcon />
        </TouchableOpacity>
      </View>

      {/* Main content - Facial SVG */}
      <View style={styles.svgWrapper}>
        <CallSvg width={width} height={height} preserveAspectRatio="xMidYMid slice" />
      </View>

      {/* Bottom buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cameraButton}
          activeOpacity={0.85}
        >
          <Cam />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.phoneButton}
          activeOpacity={0.85}
        >
          <Phone />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraButton}
          activeOpacity={0.85}
        >
          <Speaker />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraButton}
          activeOpacity={0.85}
        >
          <Mic />
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
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFFBF',
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
  svgWrapper: {
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
    paddingHorizontal: 30,
    paddingBottom: 40,
    gap: 16,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    left: '15%',
    right: '15%',
    zIndex: 100,
    width: '70%',
    alignItems: 'center',
  },
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#A4A1A1CF',
    paddingVertical: 10,
    borderRadius: 50,
    width: 40,
    padding: 10,
    height: 40,
  },
  phoneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B70000',
    borderRadius: 50,
    width: 40,
    padding: 10,
    height: 40,
    
  },
});