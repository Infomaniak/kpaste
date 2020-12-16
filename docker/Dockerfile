FROM nginx:1.19.5-alpine

ARG CI_COMMIT_BRANCH

COPY default.conf.template /etc/nginx/templates/
COPY index.html /var/www/
