FROM node:carbon
WORKDIR /src/
COPY package*.json ./
RUN npm install
RUN npm install amqplib
RUN npm install xmlhttprequest
COPY . .
EXPOSE 8080
CMD npm start
