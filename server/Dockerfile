# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./server/

# Install dependencies
RUN cd server && npm install

# Copy all files
COPY . .

# Build client
RUN cd client && npm install && npm run build

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "run", "start:prod"]