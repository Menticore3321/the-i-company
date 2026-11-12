FROM node:20-slim

# Install latest Chrome dependencies for Puppeteer
RUN apt-get update \
    && apt-get install -y wget gnupg ca-certificates procps libxss1 \
       libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
       libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
       libxrandr2 libgbm1 libasound2 fonts-liberation libpango-1.0-0 \
       libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH="" \
    NODE_ENV=production \
    PORT=4000

EXPOSE 4000

CMD ["npm", "start"]

