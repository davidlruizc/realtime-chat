import React from 'react';
import {View, Platform} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const SOCKET_URI =
  Platform.OS === 'ios' ? 'http://localhost:3001' : 'http://10.0.2.2:3001';

const API_URI =
  Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

const socket = io(SOCKET_URI, {
  path: '/websockets/',
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: Infinity,
  jsonp: false,
});

const Chat = ({navigation, route}) => {
  const [messages, setMessages] = React.useState([]);
  const [nicknameStorage, setNicknameStorage] = React.useState('');

  const {params} = route;

  const roomsService = React.useCallback(async () => {
    try {
      const room = await fetch(`${API_URI}/api/rooms/${params}`, {
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
        `${API_URI}/api/messages`,
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
      const nickName = await AsyncStorage.getItem('nickname');
      setNicknameStorage(nickName);
      socket.emit('enter-chat-room', {
        roomId: params,
        nickname: nickName,
      });

      const room = await roomsService();

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
        }
      });
      setMessages(chatData);

      socket.on('message', (message) => messages.push(message));

      socket.on('users-changed', (data) => {
        // add event when user status change
        const user = data.user;

        //if (data['event'] === 'left') {
        //console.log(`User left: ${user}`);
        //} else {
        //console.log(`User joined: ${user}}`);
        //}
      });
    } catch (err) {
      throw new Error(err);
    }
  }, [params, roomsService, messageService, messages]);

  const removeSocketsListeners = React.useCallback(() => {
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
      alignTop
      alwaysShowSend
      scrollToBottom
      renderAvatarOnTop
      renderUsernameOnMessage
      inverted={false}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderLoading={() => <View style={{flex: 1}} />}
      user={{
        _id: 1,
      }}
    />
  );
};

export default Chat;
