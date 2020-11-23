# Realtime Chat Monorepo

Full stack chat based on rooms chat like discord or slack.

## Backend API

- NestJS
- Socket.io 
- Typegoose

```sh
npm start
```

## Database

- MongoDB
- Docker

Run the database

```sh
cd db; docker-compose up
```

Login to your container by using container names

```sh
docker exec -it <container-name> bash
```

Login to MongoDB with created User & Database by using

```sh
mongo -u <your username> -p <your password> --authenticationDatabase <your database name>
```

Stop the container

```sh
cd db; docker-compose down
```

## Mobile App

### Warning!

Make sure to install `socket.io-client@2.1.1` to avoid bug in socket connection with backend.

Bug report on `socket.io` library [1245-535271575](https://github.com/socketio/socket.io-client/issues/1245#issuecomment-535271575) and [1245-535665760](https://github.com/socketio/socket.io-client/issues/1245#issuecomment-535665760)

- React Native
- React Navigation
- Socket.io-client

Run the app acording the OS

For iOS:

```sh
cd chatApp; npm run ios
```

For Android:

```sh
cd chatApp; npm run android 
```
