import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function GetStartedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/get-started.png')} // Rename your image to this and place in /assets
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>
        Find Your Ideal <Text style={styles.highlight}>Tuition/Tutor</Text> Near You
      </Text>

      <Text style={styles.subheading}>
        Discover top-rated physical tuition classes nearby with AI-powered matching, smart scheduling, and real-time availability.
      </Text>

      <TouchableOpacity 
  style={styles.primaryButton} 
  onPress={() => navigation.navigate('RoleSelection')}
>
  <Text style={styles.primaryButtonText}>Get started</Text>
</TouchableOpacity>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '98%',
    height: 300,
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
     fontFamily: 'Nunito_700Bold',
  },
  highlight: {
    color: '#088F9E',
    fontWeight: '700',
     fontFamily: 'Nunito_700Bold',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
     fontFamily: 'Nunito_400Regular',
  },
  primaryButton: {
    backgroundColor: '#088F9E',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
     fontFamily: 'Nunito_700Bold',
  },
  secondaryButton: {
    borderColor: '#4db5ff',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
