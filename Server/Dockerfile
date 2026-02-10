# 1. Base image
FROM node:20-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy backend deps manifest
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy backend code
COPY . .

# 6. Expose port your server listens on
EXPOSE 3000

# 7. Start server
CMD ["npm", "start"]

