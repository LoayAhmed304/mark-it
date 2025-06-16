FROM node:22.11.0


RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "start"]