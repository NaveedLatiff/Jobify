FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

# You mentioned backend is on 3000
EXPOSE 3000

CMD ["npm", "start"]