FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

RUN mkdir -p src/data

EXPOSE 3001

USER node

CMD ["npm", "start"]