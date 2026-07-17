FROM node:18-alpine

LABEL maintainer="SnipKlip"
LABEL version="2.0.0"

# Creates directories
RUN mkdir -p /usr/src/app

# Sets an environment variable
ENV PORT=8081

# Sets the working directory for any RUN, CMD, ENTRYPOINT, COPY, and ADD commands
WORKDIR /usr/src/app

# Copy new files or directories into the filesystem of the container
COPY package.json package-lock.json ./

# Execute commands in a new layer on top of the current image and commit the results
RUN npm ci --legacy-peer-deps

# Copy new files or directories into the filesystem of the container
COPY . /usr/src/app

RUN npm run build

# Informs container runtime that the container listens on the specified network ports at runtime
EXPOSE 8081

# Allows you to configure a container that will run as an executable
CMD [ "npm", "start" ]