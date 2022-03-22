FROM node:12-alpine

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/

ENV REACT_APP_USE_DOCKER 1
EXPOSE 3000
CMD ["npm", "run", "start"]
