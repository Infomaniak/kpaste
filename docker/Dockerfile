FROM nginx:1.21.0-alpine

ARG CI_COMMIT_BRANCH
ENV CI_COMMIT_BRANCH=$CI_COMMIT_BRANCH

COPY default.conf.template /etc/nginx/templates/
COPY index.html /var/www/
