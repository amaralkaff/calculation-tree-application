FROM node:20-alpine

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Clean install to ensure platform-specific binaries
RUN npm ci --prefer-offline --no-audit

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
