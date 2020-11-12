FROM nginx:1.19.4-alpine

ARG CI_COMMIT_BRANCH
ENV PROJECT_BRANCH=$CI_COMMIT_BRANCH

COPY default.conf.template /etc/nginx/templates/
COPY index.html /var/www/
