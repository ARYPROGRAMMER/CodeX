# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with the legacy peer deps option
RUN npm install --legacy-peer-deps

# Copy the entire application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
