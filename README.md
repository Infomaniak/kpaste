# Infomaniak paste

## install

```bash
export WEB_COMPONENT_ENDPOINT="https://web-components.storage.infomaniak.com/next/init.js"
export WEB_COMPONENT_API_ENDPOINT="https://welcome.infomaniak.com"
```

```bash
npm i
```

## build dev

```bash
npm start
```

## build prod

```bash
npm run build
```

## k8s

folder `kubernetes`

## docker

folder `docker`

## prod infrastructure

we are using S3 storage and nginx to reverse proxy it

## cypress test

see `cypress` folder

## CI

- linter
- dependency check
- cypress
- s3 push
- docker image (nginx)
- docker image check

## precommit hook

There is a precommit hook based on eslint check
