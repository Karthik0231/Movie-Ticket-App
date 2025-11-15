import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useTheme } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Context/Context';
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ToastAndroid } from "react-native";
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { colors } = useTheme();
  const { signIn } = useContext(AuthContext);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const navigator = useNavigation();

    const handleLogin = () => {
        (async () => {
          try {
            setLoadingSignIn(true);
            const res = await signIn({ email, password });
            setLoadingSignIn(false);
            if (res && res.success) {
              // Parent reads AuthContext.user and will switch to admin Home
              navigator.reset({
      index: 0,
      routes: [{ name: 'Parent' }], // or name of your main screen
    });
            } else {
              ToastAndroid.show(res?.message || 'Login failed', ToastAndroid.SHORT);
            }
          } catch (err) {
            setLoadingSignIn(false);
            ToastAndroid.show('Login error', ToastAndroid.SHORT);
          }
        })();
    };

  return (
    <>
      <StatusBar
        barStyle={colors.custom === "darkTheme" ? "light-content" : "dark-content"}
        backgroundColor={colors.background_default}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ backgroundColor: colors.background_default }}
      >
        <View className="flex-1 justify-center px-6">
          {/* Premium Header Section */}
          <View className="mb-12">
            <View className="flex-row items-center mb-4">
              <LinearGradient
                colors={[colors.primary_light, colors.primary_main]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                style={{
                  shadowColor: colors.primary_main,
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 8,
                }}
              >
                <Icon name="movie-open" size={28} color="#FFFFFF" />
              </LinearGradient>
              <View>
                <Text
                  className="text-3xl font-p_bold"
                  style={{ color: colors.text_primary, letterSpacing: 0.5 }}
                >
                  Welcome Back
                </Text>
                <View className="flex-row items-center mt-1">
                  <View
                    className="w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.gold }}
                  />
                  <Text
                    className="text-sm font-p_med"
                    style={{ color: colors.text_secondary }}
                  >
                    Admin Portal Access
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Premium Card Container */}
          <View
            className="rounded-3xl p-8 border"
            style={{
              backgroundColor: colors.background_paper,
              borderColor: colors.divider,
              shadowColor: colors.custom === "darkTheme" ? "#000" : colors.primary_main,
              shadowOpacity: colors.custom === "darkTheme" ? 0.5 : 0.08,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 12,
            }}
          >
            {/* Email Field */}
            <View className="mb-6">
              <Text
                className="text-xs font-p_semi uppercase mb-3"
                style={{
                  color: emailFocused ? colors.primary_main : colors.text_secondary,
                  letterSpacing: 1.2,
                }}
              >
                Email Address
              </Text>
              <View
                className="flex-row items-center rounded-2xl px-5 border"
                style={{
                  backgroundColor: colors.background_neutral,
                  borderColor: emailFocused ? colors.primary_main : "transparent",
                  borderWidth: emailFocused ? 1.5 : 1,
                }}
              >
                <Icon
                  name="email-outline"
                  size={22}
                  color={emailFocused ? colors.primary_main : colors.iconColor}
                />
                <TextInput
                  placeholder="admin@example.com"
                  placeholderTextColor={colors.text_disabled}
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="flex-1 h-14 ml-4 text-base font-p_med"
                  style={{ color: colors.text_primary }}
                />
                {email.length > 0 && (
                  <TouchableOpacity onPress={() => setEmail("")}>
                    <Icon name="close-circle" size={20} color={colors.iconColor} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-8">
              <Text
                className="text-xs font-p_semi uppercase mb-3"
                style={{
                  color: passwordFocused ? colors.primary_main : colors.text_secondary,
                  letterSpacing: 1.2,
                }}
              >
                Password
              </Text>
              <View
                className="flex-row items-center rounded-2xl px-5 border"
                style={{
                  backgroundColor: colors.background_neutral,
                  borderColor: passwordFocused ? colors.primary_main : "transparent",
                  borderWidth: passwordFocused ? 1.5 : 1,
                }}
              >
                <Icon
                  name="lock-outline"
                  size={22}
                  color={passwordFocused ? colors.primary_main : colors.iconColor}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={colors.text_disabled}
                  secureTextEntry={secureText}
                  onChangeText={setPassword}
                  value={password}
                  autoCapitalize="none"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="flex-1 h-14 ml-4 text-base font-p_med"
                  style={{ color: colors.text_primary }}
                />
                <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  className="p-2"
                >
                  <Icon
                    name={secureText ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={colors.iconColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Premium Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              className="rounded-2xl overflow-hidden"
              style={{
                shadowColor: colors.primary_main,
                shadowOpacity: 0.4,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
              }}
            >
              <LinearGradient
                colors={[colors.primary_light, colors.primary_main, colors.primary_dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-16 justify-center items-center"
              >
                <View className="flex-row items-center">
                  <Text
                    className="text-lg font-p_bold mr-2"
                    style={{ color: colors.onPrimary, letterSpacing: 1 }}
                  >
                    Sign In
                  </Text>
                  <Icon name="arrow-right" size={20} color={colors.onPrimary} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default LoginScreen;