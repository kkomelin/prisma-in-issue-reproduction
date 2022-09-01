A playground to reproduce the issue https://github.com/prisma/prisma/pull/15124
=

## Run the db server:

Please note the db server will be run on port 3306, so make sure you freed it up before running docker-compose.

```bash
docker-compose up -d
```

## Install dependencies and run the reproduction script:

```bash
yarn install
yarn db:push
yarn reproduce
```
