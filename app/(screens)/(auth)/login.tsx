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
} from "react-native";

import { Text } from "@/components/text";
import { InstrumentSans } from "@/constants/theme";
import MailIcon from "../../../assets/icons/email.svg";
import LockIcon from "../../../assets/icons/lock.svg";
import EyeIcon from "../../../assets/icons/eye.svg";
import Google from "../../../assets/icons/google.svg";
import Apple from "../../../assets/icons/apple.svg";
import { router } from "expo-router";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
              <Text style={styles.helloText}>Hello!</Text>
              <Text style={styles.welcomeText}>
                <Text style={styles.welcomeGray}>Welcome to </Text>
                <Text style={styles.welcomeBrand}>BEAUTY HUB!</Text>
              </Text>
            </View>
            {/* <View style={styles.glowAccent}></View> */}
          </View>

          {/* Card */}
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              {/* Login Title */}
              <Text style={styles.loginTitle}>Login</Text>

              {/* Inputs */}
              <View style={styles.inputsContainer}>
                {/* Email Input */}
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <MailIcon />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
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
                    placeholder="Password"
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
              </View>

              <TouchableOpacity
                style={styles.forgetPasswordLink}
                onPress={() => router.push("/(screens)/(auth)/forgot-password")}
                activeOpacity={0.7}
              >
                <Text style={styles.forgetPasswordText}>Forget password</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity style={styles.loginButton} activeOpacity={0.85}>
                <Text style={styles.loginButtonText}>Login</Text>
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
                  {/* Replace with actual Google icon */}
                  <Google />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                >
                  {/* Replace with actual Apple icon */}
                  <Apple />
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <Text style={styles.signupText}>
                <Text style={styles.signupGray}>Don't have an account? </Text>
                <Text style={styles.signupLink} onPress={() => router.push("/(screens)/(auth)/signup")}>Sign up</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    // Gradient simulation: top area is blue-tinted via header bg
  },
  logoWrapper: {
    position: "relative",
  },
  glowAccent: {
    position: "absolute",
    top: -10,
    left: 86,
    width: 182,
    height: "100%",
    backgroundColor: "#00b3fa",
    borderRadius: 91,
    opacity: 0.1,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#e3f2fd",
    height: 43,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 32,
    backgroundColor: "#fff",
    gap: 8,
  },
  helloText: {
    fontWeight: "600",
    fontSize: 28,
    color: "#000",
    fontFamily: "sora-bold",
  },
  welcomeText: {
    fontSize: 18,
  },
  welcomeGray: {
    color: "#525151",
    fontWeight: "400",
    fontSize: 18,
  },
  welcomeBrand: {
    color: "#00b3fa",
    fontWeight: "600",
    fontSize: 20,
  },
//   glowAccent: {
//     position: "absolute",
//     top: 43,
//     left: 86,
//     width: 182,
//     height: 79,
//     backgroundColor: "#00b3fa",
//     borderRadius: 91,
//     opacity: 0.35,
//     // Note: blur not natively supported; use react-native-blur for full effect
//   },
  cardWrapper: {
    flex: 1,
    paddingTop: 50,
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
    gap: 32,
    height: "100%",
  },
  loginTitle: {
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
  },
  iconText: {
    fontSize: 16,
    color: "#525151",
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
  forgetPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  forgetPasswordText: {
    fontSize: 14,
    color: "#00b3fa",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#FC65D1",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 269,
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
  socialIcon: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
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
});

export default Login;
