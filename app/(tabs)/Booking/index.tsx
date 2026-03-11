import { StyleSheet, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text } from '@/components/text';
import Carter from '../../../assets/images/Carter.svg';
import Michael from '../../../assets/images/Michael.svg';
import Aisha from '../../../assets/images/Aisha.svg';

const DOCTORS = [
  { id: 'carter', name: 'Dr. Emily Carter', title: 'Board-Certified Dermatologist', experience: '8+ Years Experience', rating: 4.8, reviews: 124, price: 40, nextAvailable: 'Today, 3:30pm', Avatar: Carter },
  { id: 'reynolds', name: 'Dr. Michael Reynolds', title: 'Board-Certified Dermatologist', experience: '12+ Years Experience', rating: 4.9, reviews: 210, price: 55, nextAvailable: 'Tomorrow, 10:00 AM', Avatar: Michael },
  { id: 'thompson', name: 'Dr. Aisha Thompson', title: 'Board-Certified Dermatologist', experience: '8+ Years Experience', rating: 4.9, reviews: 156, price: 45, nextAvailable: 'Today, 6:15 PM', Avatar: Aisha },
  { id: 'kim', name: 'Dr. Daniel Kim', title: 'Dermatology & Research Specialist', experience: '15 Years Experience', rating: 4.8, reviews: 302, price: 60, nextAvailable: 'Tomorrow, 2:00 PM', Avatar: Michael },
];

export default function BookingList() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Book a Consultation</Text>
          <Text style={styles.headerSubtitle}>Get expert guidance based on your AI skin analysis.</Text>
        </View>
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
        />
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="filter" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Dermatologist Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Dermatologist</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {DOCTORS.map((doctor) => (
        <View key={doctor.id} style={styles.card}>
          <View style={styles.doctorRow}>
            <View style={styles.avatarWrap}>
              <doctor.Avatar width={64} height={64} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorTitle}>{doctor.title}</Text>
              <Text style={styles.experience}>{doctor.experience}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{doctor.rating} ({doctor.reviews} Reviews)</Text>
              </View>
              <Text style={styles.nextAvailable}>Next Available: {doctor.nextAvailable}</Text>
            </View>
            <Text style={styles.price}>${doctor.price}/Sess</Text>
          </View>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push({ pathname: '/(tabs)/Booking/dermatologist', params: { id: doctor.id } })}
            activeOpacity={0.85}
          >
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#525151',
    marginTop: 4,
  },
  bellButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  seeAll: {
    fontSize: 14,
    color: '#FC65D1',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  doctorTitle: {
    fontSize: 14,
    color: '#525151',
    marginTop: 2,
  },
  experience: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#525151',
  },
  nextAvailable: {
    fontSize: 12,
    color: '#525151',
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  bookBtn: {
    backgroundColor: '#FC65D1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
