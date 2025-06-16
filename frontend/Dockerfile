FROM node:22-alpine

WORKDIR /home/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
