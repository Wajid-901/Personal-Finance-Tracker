# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
