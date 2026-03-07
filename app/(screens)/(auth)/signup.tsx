import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { router } from "expo-router";

import { Text } from "@/components/text";
import { InstrumentSans } from "@/constants/theme";
import UserIcon from "../../../assets/icons/user.svg";
import MailIcon from "../../../assets/icons/email.svg";
import LockIcon from "../../../assets/icons/lock.svg";
import EyeIcon from "../../../assets/icons/eye.svg";
import Google from "../../../assets/icons/google.svg";
import Apple from "../../../assets/icons/apple.svg";

const SKIN_TYPE_OPTIONS = [
  "A Dermatologist",
  "Skincare Professional",
  "Personal Use",
];

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [useage, setUseage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectVisible, setSelectVisible] = useState(false);

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
        >
          {/* Header */}
          <View style={styles.logoWrapper}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Create Your Account!</Text>
              <Text style={styles.subHeader}>
                Start your personalized skin analysis journey in seconds.
              </Text>
            </View>
          </View>

          {/* Card */}
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              {/* Card Title */}
              <Text style={styles.cardTitle}>Create Account</Text>

              {/* Inputs */}
              <View style={styles.inputsContainer}>
                {/* Name Input */}
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <UserIcon width={18} height={22} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Type your name"
                    placeholderTextColor="#525151"
                    autoCapitalize="words"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* Email Input */}
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <MailIcon width={20} height={16} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Type your email"
                    placeholderTextColor="#525151"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <LockIcon />
                  </View>
                  <TextInput
                    style={[styles.input, styles.inputWithRightIcon]}
                    placeholder="Type your password"
                    placeholderTextColor="#525151"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon />
                  </TouchableOpacity>
                </View>
                
                 {/* Select Field */}
                <TouchableOpacity
                  style={styles.selectWrapper}
                  onPress={() => setSelectVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.selectText,
                      !useage && styles.selectPlaceholder,
                    ]}
                  >
                    {useage || "I am using this app as:"}
                  </Text>
                  <Text style={styles.selectChevron}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Remember Me & Forget Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(screens)/(auth)/forgot-password")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgetText}>Forget password</Text>
                </TouchableOpacity>
              </View>

              {/* Create Account Button */}
              <TouchableOpacity style={styles.createButton} activeOpacity={0.85}>
                <Text style={styles.createButtonText}>Sign up</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                >
                  <Google />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                >
                  <Apple />
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View style={styles.signupRow}>
                <Text style={styles.signupGray}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(screens)/(auth)/login")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signupLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Select Modal */}
      <Modal
        visible={selectVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select usage</Text>
            {SKIN_TYPE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionItem}
                onPress={() => {
                  setUseage(option);
                  setSelectVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
                {useage === option && (
                  <Text style={styles.optionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  logoWrapper: {
    position: "relative",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: "#fff",
    gap: 8,
  },
  headerTitle: {
    fontWeight: "600",
    fontSize: 28,
    color: "#000",
  },
  subHeader: {
    fontSize: 18,
    color: "#525151",
    fontWeight: "400",
  },
  cardWrapper: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: "#fff",
    height: "100%",
  },
  card: {
    backgroundColor: "#C2CFD754",
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingTop: 30,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 24,
    height: "100%",
  },
  cardTitle: {
    fontWeight: "500",
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
  inputsContainer: {
    width: "100%",
    gap: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 43,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#01010140",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#525151",
    height: "100%",
    fontFamily: InstrumentSans.regular,
  },
  inputWithRightIcon: {
    paddingRight: 32,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
  },
  selectWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 43,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#01010140",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 15,
    color: "#000",
    fontFamily: InstrumentSans.regular,
  },
  selectPlaceholder: {
    color: "#525151",
  },
  selectChevron: {
    fontSize: 10,
    color: "#525151",
  },
  optionsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#01010140",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#00b3fa",
    borderColor: "#00b3fa",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  rememberText: {
    fontSize: 14,
    color: "#525151",
  },
  forgetText: {
    fontSize: 14,
    color: "#D30707",
    fontWeight: "500",
  },
  createButton: {
    width: "100%",
    backgroundColor: "#FC65D1",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center", 
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 269,
    gap: 7,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(82,81,81,0.3)",
  },
  dividerText: {
    fontSize: 14,
    color: "#525151",
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  signupText: {
    fontSize: 16,
    textAlign: "center",
  },
  signupGray: {
    color: "#525151",
  },
  signupLink: {
    color: "#00b3fa",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  optionCheck: {
    fontSize: 16,
    color: "#00b3fa",
    fontWeight: "600",
  },
});

export default Signup;
