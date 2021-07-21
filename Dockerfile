FROM node:12-alpine
WORKDIR /app
COPY ./server.js ./package*.json ./webpack.config.js ./html.d.ts ./tsconfig.json ./
COPY ./src ./src
COPY ./static ./static
RUN npm install && npm run build
RUN rm -rf ./src && rm -rf ./static
EXPOSE 3000
CMD node server.js
