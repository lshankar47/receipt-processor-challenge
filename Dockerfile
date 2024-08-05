FROM node:18-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN npm install typescript jest

COPY . .

RUN npm run build

EXPOSE 3000

# RUN npm start
CMD ["node", "dist/index.js"]