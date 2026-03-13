import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DP from "../../assets/images/DP.svg";
import Scan from "../../assets/icons/Scan.svg";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/text";
import FacialFrame from "../../assets/images/HomeImage.svg";
import HomeImage2 from "../../assets/images/HomeImage2.svg";

export default function Home() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <DP width={48} height={48} />
          </View>
          <View>
            <Text style={styles.greeting}>Good Morning Tina,</Text>
            <Text style={styles.subGreeting}>
              Here's your skin update for today.
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Scan width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Skin Health Score Card */}
      <View style={[styles.card, { backgroundColor: "#FC65D1", padding: 0,borderRadius: 10,borderColor: "#00B4FA29",borderWidth: 1 }]}>
        <View style={styles.scoreContent}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreTitle}>Skin Health Score: 78/100</Text>
            <Text style={styles.scoreSubtitle}>
              Healthy, but some areas need attention.
            </Text>
            <TouchableOpacity style={styles.scanAgainBtn} activeOpacity={0.85}>
              <Text style={styles.scanAgainText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.scoreRight}> */}
          <FacialFrame width={150} height={120} style={styles.facialFrame} />
          {/* </View> */}
        </View>
      </View>

      {/* Areas Detected Card */}
      {/* <View style={[styles.card , { padding: 10,borderRadius: 10,borderColor: "#00B4FA29",borderWidth: 1 }]}> */}
      <LinearGradient
        colors={["#fff", "#fff", "#00B4FA29"]}
        style={[
          styles.card,
          {
            padding: 10,
            borderRadius: 10,
            borderColor: "#00B4FA29",
            borderWidth: 1,
          },
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Text style={styles.cardTitle}>Areas Detected</Text>
        <View style={[styles.areasContent]}>
          <View style={styles.areasRow}>
            <View style={[styles.areaDot, styles.acneDot]} />
            <Text style={styles.areaLabel}>Acne Zones</Text>
          </View>
          <View style={styles.areasRow}>
            <View style={[styles.areaDot, styles.darkSpotDot]} />
            <Text style={styles.areaLabel}>Dark Spots</Text>
          </View>
          <View style={styles.areasRow}>
            <View style={[styles.areaDot, styles.drynessDot]} />
            <Text style={styles.areaLabel}>Dryness Areas</Text>
          </View>
        </View>
      </LinearGradient>
      {/* </View> */}

      {/* Recent Analysis Card */}
      <View style={styles.card}>
        <View style={styles.recentHeader}>
          <Text style={styles.cardTitle}>Recent Analysis</Text>
          <Text style={styles.recentTime}>2 days ago</Text>
        </View>
        {/* <View style={styles.recentImagePlaceholder}> */}
          <HomeImage2  style={styles.facialFrame} />
        {/* </View> */}
        <TouchableOpacity
          style={styles.viewReportBtn}
          onPress={() =>
            router.push("/(screens)/(main screens)/facialanalysis")
          }
          activeOpacity={0.85}
        >
          <Text style={styles.viewReportText}>View full report</Text>
        </TouchableOpacity>
      </View>

      {/* Dermatologist Consultation Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dermatologist Consultation</Text>
        <View style={styles.doctorRow}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>SJ</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
            <Text style={styles.doctorTitle}>Dermatology Specialist</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>4.9 (127 Reviews)</Text>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => router.push("/(screens)/(main screens)/call")}
          activeOpacity={0.85}
        >
          <Text style={styles.chatBtnText}>Start Chat Consultation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 50,
    // backgroundColor: "#C4C4C4",
  },
  facialFrame: {
    // marginTop: 10,
    // position: "absolute",
    // right: -20,
    // top: 0,
    // left: 10
  },
  areasContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  subGreeting: {
    fontSize: 15,
    color: "#525151",
    marginTop: 2,
  },
  expandButton: {
    padding: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  scoreContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreLeft: {
    flex: 1,
    padding: 20,
  },
  scoreTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },
  scoreSubtitle: {
    fontSize: 14,
    color: "white",
    marginTop: 4,
  },
  scanAgainBtn: {
    marginTop: 16,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  scanAgainText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },
  scoreRight: {
    backgroundColor: "#FCE4EC",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  areasRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  areaDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  acneDot: { backgroundColor: "#E53935" },
  darkSpotDot: { backgroundColor: "#FF9800" },
  drynessDot: { backgroundColor: "#03A9F4" },
  areaLabel: {
    fontSize: 14,
    color: "#000",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentTime: {
    fontSize: 12,
    color: "#525151",
  },
  recentImagePlaceholder: {
    height: 180,
    borderRadius: 12,
    backgroundColor: "#E8E8E8",
    marginBottom: 12,
    overflow: "hidden",
  },
  recentImage: {
    flex: 1,
    backgroundColor: "#D0D0D0",
  },
  viewReportBtn: {
    backgroundColor: "#FC65D1",
    paddingVertical: 8,
    alignSelf: "flex-start",
    color: "#fff",
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
    height: 40,
  },
  viewReportText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    justifyContent: "center",
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFCDD2",
    alignItems: "center",
    justifyContent: "center",
  },
  doctorAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  doctorTitle: {
    fontSize: 14,
    color: "#525151",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#525151",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  onlineText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  chatBtn: {
    backgroundColor: "#FC65D1",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  chatBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
