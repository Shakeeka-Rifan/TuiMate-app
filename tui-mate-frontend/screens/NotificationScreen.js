// NotificationScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

export default function NotificationScreen({ route }) {
  const { notifications = [] } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={require('../assets/images/avatar.png')}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.sender}>From: {item.senderId}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>No new notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center'
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 12
  },
  content: { flex: 1 },
  sender: { fontWeight: '600', fontSize: 14 },
  message: { fontSize: 14, marginVertical: 4 },
  time: { fontSize: 12, color: '#888' }
});
