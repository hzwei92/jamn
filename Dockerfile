
FROM node:18-alpine
 
WORKDIR /src
 
COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "start:prod"]