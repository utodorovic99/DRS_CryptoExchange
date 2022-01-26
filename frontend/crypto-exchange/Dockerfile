FROM node:16-alpine
WORKDIR .
ENV PATH="./node_modules/.bin:$PATH"
COPY package.json yarn.lock ./
COPY /src /src
COPY /public /public
# RUN npm run build
RUN yarn install