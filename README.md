# Realtime Chat Monorepo

## Backend API

- NestJS
- Web Sockets

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

