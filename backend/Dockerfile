FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Create data directory
RUN mkdir -p src/data

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]