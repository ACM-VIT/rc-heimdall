FROM node:15.3.0-alpine3.10

ENV PORT=80
ENV NODE_ENV='production'
ENV DB_HOST='localhost'
ENV DB_USERNAME='postgres'
ENV DB_PASSWORD='postgres'
ENV DB_NAME='reverse_coding'
ENV RUNNER_ENDPOINT_EXEC='https://webhook.site/1406fdc8-be02-4774-b694-7b9d0696e203' 
ENV RUNNER_ENDPOINT_SEED='https://webhook.site/1406fdc8-be02-4774-b694-7b9d0696e203'
ENV JUDGE_CALLBACK='https://webhook.site/1406fdc8-be02-4774-b694-7b9d0696e203'

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install

# Copy all other source code to work directory
ADD . /usr/src/app

# Build the project
RUN npm run build

# run the server
CMD ["npm", "start"] 

EXPOSE 80