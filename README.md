# Realtime Chat Monorepo

## Backend API

- NestJS
- Web Sockets

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

- React Native

Run the app acording the OS

For iOS:

```sh
cd chatApp; npm run ios
```

For Android:

```sh
cd chatApp; npm run android 
```
