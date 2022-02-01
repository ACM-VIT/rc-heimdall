FROM node:15.3.0-alpine3.10

# Labls
LABEL maintainer="Yash Kumar Verma yk.verma2000@gmail.com"

# Document environment configurations
# ENV PORT=80
# ENV NODE_ENV='production'
# ENV DB_HOST='localhost'
# ENV DB_USERNAME='postgres'
# ENV DB_PASSWORD='postgres'
# ENV DB_NAME='reverse_coding'
# ENV RUNNER_ENDPOINT_EXEC='https://webhook.site/1406fdc8-be02-4774-b694-7b9d0696e203' 
# ENV RUNNER_ENDPOINT_SEED='https://webhook.site/1406fdc8-be02-4774-b694-7b9d0696e203'
# ENV JUDGE_CALLBACK='https://webhook.site/1406fdc8-be02-4774-b694-7b9d0696e203'
# ENV JUDGE_ENDPOINT='127.0.0.1'
# ENV ASSIGN_PROBLEM_TO_TEAM=false
# ENV API_ENDPOINT='api'

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