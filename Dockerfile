# syntax=docker/dockerfile:1
FROM node:16

# Add package file
COPY package-lock.json ./
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN npm run build

WORKDIR /dist

CMD ["node", "app.js"]
EXPOSE 8080