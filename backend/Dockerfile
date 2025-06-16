FROM node:22.11.0

ENV NODE_ENV=production

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
CMD ["npm", "start"]