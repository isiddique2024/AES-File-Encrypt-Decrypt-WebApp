FROM nginx:alpine-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY sites-available /etc/nginx/sites-available

RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default