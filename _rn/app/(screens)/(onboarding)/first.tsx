import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/text';
import Onboarding1 from '../../../assets/images/Onboarding1.svg';
import ArrowRight from '../../../assets/icons/Arrowright.svg';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const First = () => {
  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
        <Onboarding1 width={width} height={height} preserveAspectRatio="xMidYMid slice" />
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(202, 198, 193, 0.89)', '#CAC6C1E8']}
        style={styles.content}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      >
        <Text style={styles.maintext}>Your Skin, Analyzed In Seconds</Text>
        <View style={styles.subtextWrapper}>
          <Text style={styles.subtext}>Receive a detailed skin health score, problem detectin heatmaps, and custom care recommendations tailored to ayour skin type</Text>
          <TouchableOpacity style={styles.buttonWrapper} onPress={() => router.push("/(screens)/(onboarding)/second")}>
            <ArrowRight />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default First;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 550,
    padding: 10,
    flexDirection: "column",
    gap: 10,
    // height: '100%',
  },
  maintext: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    maxWidth: '90%',
    lineHeight: 40,
    textAlign: 'left',
  },
  subtextWrapper: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
  subtext: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#000',
    textAlign: 'left',
    width: '75%',
    lineHeight: 24,
    marginTop: 10,
  },
  buttonWrapper: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#FC65D1'
  },
  button: {
    width: 40,
    height: 40,
  },
});
