# A Dockerfile is a "recipe" for building a container image
# Think of a container as a mini-computer with your app inside

# Line 1: Start from a base image (Node.js 18 on Alpine Linux - tiny & fast)
FROM node:18-alpine

# Line 2: Set the working directory inside the container
WORKDIR /app

# Line 3: Copy package.json first (for better caching)
# Why? If dependencies don't change, Docker reuses the cached layer
COPY package.json .

# Line 4: Install dependencies
RUN npm install --production

# Line 5: Copy the rest of the app code
COPY . .

# Line 6: Tell Docker the app listens on port 3000
EXPOSE 3000

# Line 7: Command to run when container starts
CMD ["node", "server.js"]
