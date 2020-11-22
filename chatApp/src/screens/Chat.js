import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  path: '/websockets/',
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: Infinity,
  jsonp: false,
});

const Chat = ({navigation, route}) => {
  const [messages, setMessages] = React.useState([]);
  const [roomChat, setRoomChat] = React.useState(null);
  const [nicknameStorage, setNicknameStorage] = React.useState('');
  const [userID, setUserID] = React.useState('1');

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

  const messageService = React.useCallback(async (roomData) => {
    try {
      const where = {where: JSON.stringify({room: roomData._id})};
      const room = await fetch(
        'http://localhost:3000/api/messages',
        {where},
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
  }, []);

  const getMessages = React.useCallback(async () => {
    try {
      console.log(await socket.connected);
      const nickName = await AsyncStorage.getItem('nickname');
      setNicknameStorage(nickName);
      socket.emit('enter-chat-room', {
        roomId: params,
        nickname: nickName,
      });

      const room = await roomsService();

      setRoomChat(room);
      const messagesResponse = await messageService(room);

      let chatData = [];

      messagesResponse.forEach((chat) => {
        if (chat) {
          const parsed = {
            _id: chat._id,
            text: chat.text,
            createdAt: chat.created,
            user: {
              _id: chat.owner._id,
              name: chat.owner.nickname,
              avatar: 'https://placeimg.com/140/140/any',
            },
          };

          chatData.push(parsed);
          setUserID(chat.owner._id);
        }
      });
      setMessages(chatData);

      socket.on('message', (message) => messages.push(message));

      socket.on('users-changed', (data) => {
        const user = data.user;

        if (data['event'] === 'left') {
          console.log(`User left: ${user}`);
        } else {
          console.log(`User joined: ${user}}`);
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }, [params, roomsService, messageService]);

  const removeSocketsListeners = React.useCallback(() => {
    //socket.removeAllListeners('message');
    //socket.removeAllListeners('users-changed');
    socket.emit('leave-chat-room', {
      roomId: params,
      nickname: nicknameStorage,
    });
  }, [params, nicknameStorage]);

  React.useEffect(() => {
    getMessages();

    return () => {
      removeSocketsListeners();
    };
  }, [getMessages, removeSocketsListeners]);

  React.useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Room: room 1'});
  }, [navigation, route]);

  const onSend = React.useCallback(
    (initialMessages = []) => {
      socket.emit('add-message', {
        text: initialMessages[0].text,
        room: params,
      });
    },
    [params],
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: userID,
      }}
    />
  );
};

export default Chat;
