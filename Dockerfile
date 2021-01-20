#FROM node:12
#COPY ./ /app
#WORKDIR /app
#RUN yarn config set registry https://registry.npm.taobao.org
#RUN yarn install
#RUN yarn build

FROM nginx
RUN mkdir /app
COPY ./dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
VOLUME /uploaded


