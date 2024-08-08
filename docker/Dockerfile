FROM nginx:1.27.0-alpine

ARG CI_COMMIT_TAG
ENV CI_COMMIT_TAG=$CI_COMMIT_TAG

COPY docker/default.conf.template /etc/nginx/templates/
COPY dist /var/www/
