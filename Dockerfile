FROM node:15.3.0-alpine3.10

# Labls
LABEL maintainer="Swarup Kharul swarupkharulsk@@gmail.com"

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install --save --legacy-peer-deps

# Copy all other source code to work directory
COPY . .

# Build the project
RUN npm run build

# run the server
CMD ["npm", "start"] 

EXPOSE 5000