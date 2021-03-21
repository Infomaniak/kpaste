FROM nginx:1.19.8-alpine

ARG CI_COMMIT_BRANCH
ENV CI_COMMIT_BRANCH=$CI_COMMIT_BRANCH

COPY default.conf.template /etc/nginx/templates/
COPY index.html /var/www/
