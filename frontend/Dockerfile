FROM node:18-alpine3.15
WORKDIR /usr/src/app/frontend
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]