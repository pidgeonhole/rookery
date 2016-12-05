#!/usr/bin/env bash
docker run -d \
           --restart always \
           --env-file .env \
           --name rookery-${ROOKERY_VERSION} \
           -p 80:3000 \
           pidgeonhole/rookery:${ROOKERY_VERSION}