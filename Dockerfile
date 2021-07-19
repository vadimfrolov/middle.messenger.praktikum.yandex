FROM ubuntu:latest
RUN apt update && apt install -y nodejs && apt install -y npm
WORKDIR /var/www
COPY ./server.js ./package.json ./webpack.config.js ./html.d.ts ./tsconfig.json ./src ./static ./
COPY ./src ./src
COPY ./static ./static
RUN npm install && npm run build
RUN rm -rf ./src && rm -rf ./static
EXPOSE 3000
CMD node server.js
