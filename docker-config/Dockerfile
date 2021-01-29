FROM nginx
RUN mkdir /app
COPY ./dist /app
COPY ./docker-config/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
VOLUME /uploaded
