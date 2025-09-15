# Use official Node.js image
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev", "--port", "3000"]