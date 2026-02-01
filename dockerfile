FROM node:22-alpine

WORKDIR /app

# 1. Build Arguments define karein
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG DATABASE_URL
ARG GEMINI_API_KEY

# 2. Inhe Environment Variables banayein taaki Prisma inhe dekh sake
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV NODE_ENV=production

# 3. Files copy karein
COPY package*.json ./
COPY prisma ./prisma/

# 4. Install dependencies (Ab DATABASE_URL mil jayega toh error nahi aayega)
RUN npm install

# 5. Baaki code aur build
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]