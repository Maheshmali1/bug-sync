# Use Node.js LTS version
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's code into the container
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
