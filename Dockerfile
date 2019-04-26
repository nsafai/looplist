# FROM lets us specify which base image from Docker Hub we want to build from. 
# In our case, we are using the latest version of the official node image.
FROM node:latest
# create a new directory
RUN mkdir -p /usr/src/app
# set newly created directory as working directory for any COPY, RUN and CMD
WORKDIR /usr/src/app
# COPY package json into working directory
COPY package.json /usr/src/app/
# execute npm install on package.json
RUN npm install
# copy rest of the app from local directory into working diretory
COPY . /usr/src/app
# expose port which container will listen on
EXPOSE 3000
# execute the container and start the node app
ENTRYPOINT npm start
# CMD [ “npm”, “start” ]