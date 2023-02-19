FROM node:18-alpine3.15 as builder
ENV PATH /usr/src/app/frontend/node_modules/.bin:$PATH
WORKDIR /usr/src/app/frontend
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY package*.json ./
RUN npm install
COPY . /usr/src/app/frontend

EXPOSE 3000
CMD ["npm", "start"]

#
#FROM nginx:1.17.8-alpine
#COPY --from=builder  /usr/src/app/frontend/build /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx/nginx.conf /etc/nginx/conf.d
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
