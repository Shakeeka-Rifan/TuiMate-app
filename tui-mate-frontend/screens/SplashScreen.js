// screens/SplashScreen.jsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0)).current; // start small

  useEffect(() => {
    // Animation for logo
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Navigate after 2.5 sec
    const timer = setTimeout(() => {
      navigation.replace('GetStarted');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.Image
        source={require('../assets/images/logooo.png')} // ✅ Replace with your logo path
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 320,   // adjust size as needed
    height: 320,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
});
