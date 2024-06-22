# Use a smaller base image
FROM node:20

# Create and set the application directory
WORKDIR /app

# Install dependencies separately for better caching
COPY package*.json ./
RUN npm install 
# Copy the rest of the application code
COPY . .
RUN npm run build
# Expose the necessary port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
