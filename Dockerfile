# syntax=docker/dockerfile:1
FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Export port for the application
EXPOSE 8080

# Set the command to run the application
CMD ["npm", "run", "start"]
