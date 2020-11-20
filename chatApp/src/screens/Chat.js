import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('http://localhost:3000');

const Chat = ({navigation, route}) => {
  const [messages, setMessages] = React.useState([]);
  const [roomChat, setRoomChat] = React.useState(null);

  const {params} = route;

  const roomsService = React.useCallback(async () => {
    try {
      const room = await fetch(`http://localhost:3000/api/rooms/${params}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const response = room.json();

      return response;
    } catch (err) {
      throw new Error(err);
    }
  }, [params]);

  const messageService = React.useCallback(
    async (roomData) => {
      try {
        const where = {where: JSON.stringify({room: roomData._id})};
        const room = await fetch(
          `http://localhost:3000/api/messages/${params}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        const response = room.json();

        return response;
      } catch (err) {
        throw new Error(err);
      }
    },
    [params],
  );

  const getMessages = React.useCallback(async () => {
    try {
      const nickName = await AsyncStorage.getItem('nickname');
      console.log(nickName);
      socket.emit('enter-chat-room', {params, nickname: nickName});

      const room = await roomsService();

      setRoomChat(room);
    } catch (err) {
      throw new Error(err);
    }
  }, [params, roomsService]);

  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);

    getMessages();
  }, [getMessages]);

  React.useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Room: room 1'});
  }, [navigation, route]);

  const onSend = React.useCallback((initialMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, initialMessages),
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default Chat;
