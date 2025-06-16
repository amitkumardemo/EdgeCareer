FROM node:22-alpine

WORKDIR /app

# 1. Copy only what's needed for dependencies
COPY package*.json ./
COPY prisma ./prisma/

# 2. Install dependencies
RUN npm install

# 3. Set build-time arguments as environment variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ARG CLERK_SECRET_KEY
ARG DATABASE_URL

# 4. Create a .env file from build arguments
RUN echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGVjZW50LXBlYWNvY2stNTguY2xlcmsuYWNjb3VudHMuZGV2JA" > .env && \
    echo "CLERK_SECRET_KEY=sk_test_u7lK4ZGXknnxdtadxMbXyptU5RmL3xsGVDEIpMVy7x" >> .env && \
    echo "DATABASE_URL=postgresql://postgres:admin@localhost:5432/edgecareer?schema=public" >> .env && \
    echo "NODE_ENV=production" >> .env

# 5. Copy the rest of the application
COPY . .

# 6. Generate Prisma client
RUN npx prisma generate

# 7. Build the application (now with .env available)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]


# run all line in terminal
#   --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_pub_key_here `
#   --build-arg CLERK_SECRET_KEY=your_secret_key_here `
#   --build-arg DATABASE_URL="your_db_url_here" `
#   -t edgecareer .