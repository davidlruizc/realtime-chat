import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';

const API_URI =
  Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

const Rooms = () => {
  const ROOM_NAME = 'room1';
  const navigation = useNavigation();

  const [roomChat, setRoomChat] = React.useState(null);

  const addRoom = async () => {
    try {
      const room = await fetch(`${API_URI}/api/rooms`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: ROOM_NAME}),
      });

      const transoformRoomResponse = await room.json();
      setRoomChat(transoformRoomResponse);
    } catch (err) {
      throw new Error(err);
    }
  };

  const joinRoom = () => {
    if (roomChat !== null) {
      navigation.navigate('Chat', roomChat._id);
    } else {
      navigation.navigate('Chat', '5fb6f5e6da1df1103546be6c');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Choose a room</Text>
          <Button title="Room 1" onPress={joinRoom} />
          <Button title="Add Room" onPress={addRoom} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  nickName: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
  },
});

export default Rooms;
