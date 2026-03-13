import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Image1 from "../../../assets/images/Frame 86.svg";

import { Text } from "@/components/text";
import { InstrumentSans } from "@/constants/theme";

const OTP_LENGTH = 4;

export default function ForgotPassword() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const maskedEmail = "user*******@gmail.com";

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with gradient-like background */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Forgot Password</Text>
          </View>

          {/* Main content - white background */}
          <View style={styles.content}>
            {/* Illustration image */}
            <Image1 width={250} height={250} />

            {/* Instruction text */}
            <Text style={styles.instructionText}>
              Code has been sent to {maskedEmail}
            </Text>

            {/* OTP Input fields */}
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={index === 0 ? OTP_LENGTH : 1}
                  placeholder="-"
                  placeholderTextColor="#999"
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Resend code link */}
            {/* <TouchableOpacity
              style={styles.resendButton}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>Resend code?</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
  },
  illustrationCard: {
    width: "100%",
    aspectRatio: 1.1,
    maxHeight: 280,
    backgroundColor: "#FCB5D0",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  instructionText: {
    fontSize: 16,
    color: "#525151",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: InstrumentSans.regular,
    marginTop: 16,
  },
  otpRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: "#87CEEB",
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: InstrumentSans.regular,
  },
  otpInputFilled: {
    borderColor: "#00b3fa",
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: "#525151",
    fontFamily: InstrumentSans.regular,
  },
});
