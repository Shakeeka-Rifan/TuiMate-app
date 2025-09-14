// src/styles/ChatScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
    paddingBottom: 10,
  },

  // ✅ Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
    top:25,
    zIndex:2000
  },
  backArrow: {
    fontSize: 22,
    color: '#000',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    top:-20
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Nunito_700Bold',
    top:20
  },
  lastSeenText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
    top:20
  },
  callIcon: {
    fontSize: 20,
    color: '#FF8C42',
  },

  // ✅ Message bubbles
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 10,
    top:28

  },
  myContainer: {
    justifyContent: 'flex-end',
  },
  theirContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#088F9E',
    elevation: 1,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    backgroundColor: '#088F9E',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    backgroundColor: '#629eabff',
  },
  messageText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Nunito_400Regular',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 5,
    color: '#fff',
    textAlign: 'right',
    fontFamily: 'Nunito_700Bold',
  },

  // ✅ Input bar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    fontFamily: 'Nunito_700Bold',
  },
  sendButton: {
    backgroundColor: '#088F9E',
    padding: 10,
    borderRadius: 25,
    marginLeft: 8,
  },
  innerContainer: {
  flex: 1,
},

  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
