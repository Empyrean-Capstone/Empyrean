# Multi-stage build
#
# https://blog.miguelgrinberg.com/post/how-to-dockerize-a-react-flask-project

# Build Step 1: build the front-end
FROM node:20.2.0-alpine as build-step

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
RUN npm install

COPY . .
RUN yarn build


# Build Step 2: build an Nginx container
FROM nginx:stable-alpine
COPY --from=build-step /app/build /usr/share/nginx/html/
COPY deployment/nginx.default.conf /etc/nginx/conf.d/default.conf
