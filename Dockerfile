FROM node:15.14-alpine
WORKDIR /code

COPY package*.json ./
RUN npm install
COPY dist ./dist
COPY socket-client ./socket-client

CMD ["npm", "run", "start:prod"]