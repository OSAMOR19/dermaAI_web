import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { Text } from '@/components/text';
import Carter from '../../../assets/images/Carter.svg';
import Michael from '../../../assets/images/Michael.svg';
import Aisha from '../../../assets/images/Aisha.svg';

const DOCTORS: Record<string, { name: string; price: number; rating: number; reviews: number; experience: string; patients: number; Avatar: typeof Carter }> = {
  carter: { name: 'Dr. Emily Carter', price: 40, rating: 4.8, reviews: 124, experience: '8+ Years Experience', patients: 20, Avatar: Carter },
  reynolds: { name: 'Dr. Michael Reynolds', price: 55, rating: 4.9, reviews: 210, experience: '12+ Years Experience', patients: 20, Avatar: Michael },
  thompson: { name: 'Dr. Aisha Thompson', price: 45, rating: 4.9, reviews: 156, experience: '8+ Years Experience', patients: 20, Avatar: Aisha },
  kim: { name: 'Dr. Daniel Kim', price: 60, rating: 4.8, reviews: 302, experience: '15 Years Experience', patients: 20, Avatar: Michael },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const DATES = Array.from({ length: 31 }, (_, i) => i + 1);

export default function DermatologistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState(10);
  const doctor = DOCTORS[id || 'carter'] || DOCTORS.carter;
  const Avatar = doctor.Avatar;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dermatologist</Text>
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Doctor Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.profileLeft}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.price}>${doctor.price}/Session</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{doctor.rating} ({doctor.reviews} Reviews)</Text>
            </View>
          </View>
          <View style={styles.avatarWrap}>
            <Avatar width={80} height={80} />
          </View>
        </View>
      </View>

      {/* Experience & Patients Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="briefcase-outline" size={24} color="#000" />
          <Text style={styles.statText}>{doctor.experience}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={24} color="#000" />
          <Text style={styles.statText}>{doctor.patients} Patients</Text>
        </View>
      </View>

      {/* Select Date */}
      <View style={styles.dateSection}>
        <View style={styles.dateSectionHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Text style={styles.nextAvailable}>Next Available: Today, 3:30pm</Text>
        </View>
        <View style={styles.calendarCard}>
          <View style={styles.daysRow}>
            {DAYS.map((day) => (
              <Text key={day} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>
          <View style={styles.datesGrid}>
            {DATES.map((date) => (
              <TouchableOpacity
                key={date}
                style={[styles.dateCell, selectedDate === date && styles.dateCellSelected]}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dateText, selectedDate === date && styles.dateTextSelected]}>{date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  bellButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#525151',
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  nextAvailable: {
    fontSize: 12,
    color: '#525151',
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dayLabel: {
    fontSize: 12,
    color: '#525151',
    fontWeight: '600',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dateCell: {
    width: '13.5%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dateCellSelected: {
    backgroundColor: '#03A9F4',
  },
  dateText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  dateTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
