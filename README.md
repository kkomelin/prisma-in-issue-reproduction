Playground for reproducing a Prisma/MariaDB issue 
=

The issue was caused by a MariaDB bug which has been fixed already in newer versions of MariaDB 

Prisma bug report: https://github.com/prisma/prisma/pull/15124  
MariaDB issue: https://jira.mariadb.org/browse/MDEV-27937

## How to use the project

### Run the db server

Please note the db server will be run on port 3306, so make sure you freed it up before running docker-compose.

```bash
docker-compose up -d
```

### Install dependencies and run the reproduction script

```bash
yarn install
yarn db:push
yarn reproduce
```
