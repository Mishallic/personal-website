FROM node:18-alpine3.15
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=12192"