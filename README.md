# Infomaniak paste

[![License][license]](https://github.com/Infomaniak/kpaste/blob/master/LICENSE)
[![Github issues][github-issues]](https://github.com/Infomaniak/kpaste/issues)
[![Github fork][github-fork]](https://github.com/Infomaniak/kpaste)
[![Github stars][github-stars]](https://github.com/Infomaniak/kpaste)
[![dependencies][dependencies-image] ][dependencies-url]
[![devdependencies][devdependencies-image] ][devdependencies-url]

[license]: https://img.shields.io/github/license/infomaniak/kpaste
[github-issues]: https://img.shields.io/github/issues/Infomaniak/kpaste
[github-fork]: https://img.shields.io/github/forks/Infomaniak/kpaste
[github-stars]: https://img.shields.io/github/stars/Infomaniak/kpaste
[dependencies-image]: https://david-dm.org/infomaniak/kpaste.svg
[dependencies-url]: https://david-dm.org/infomaniak/kpaste
[devdependencies-image]: https://david-dm.org/infomaniak/kpaste/dev-status.svg
[devdependencies-url]: https://david-dm.org/infomaniak/kpaste#info=devDependencies

Infomaniak Paste is a 100% secure solution for transferring your encrypted messages to all your contacts.

The data are encrypted and decrypted directly in your Internet browser via the 256-bit AES protocol using the Galois Counter mode.

## install

```bash
export VITE_WEB_COMPONENT_ENDPOINT="https://web-components.storage.infomaniak.com/next/init.js"
export VITE_WEB_COMPONENT_API_ENDPOINT="https://welcome.infomaniak.com"
```

```bash
nvm use 19
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

## cypress test

see `cypress` folder

## CI

- linter
- dependency check
- cypress
- docker image (nginx)
- docker image check

## precommit hook

there is a precommit hook based on eslint check
