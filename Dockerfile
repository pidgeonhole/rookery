FROM node:6.9.1-alpine

ADD . /src

WORKDIR src

RUN npm install --production

ENV DEBUG rookery:*

EXPOSE 3000

RUN chmod +x bin/www

ENTRYPOINT ["bin/www"]
