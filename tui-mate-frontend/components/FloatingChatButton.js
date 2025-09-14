// components/FloatingChatButton.js
import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingChatButton({ onPress }) {
  const pan = useRef(new Animated.ValueXY({ x: 300, y: 500 })).current; // default position

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.buttonContainer, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.chatButton} onPress={onPress}>
        <Ionicons name="chatbubbles" size={28} color="white" />
        <Text style={styles.chatText}>Chat</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    zIndex: 999,
  },
  chatButton: {
    backgroundColor: '#088F9E',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 6,
  },
  chatText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
});
