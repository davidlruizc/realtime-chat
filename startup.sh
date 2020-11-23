# !/usr/bin/env bash

cd db; docker-compose up -d; cd ..
cd chat-api; npm run start:dev
