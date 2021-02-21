# Personal expenses management

## Table of Contents

1.  [Introduction](#orgadd4bf4)
2.  [Architecture](#org986a32f)
3.  [Installing and running the project](#org499df02)
4.  [How to use](#org3112783)
5.  [Self-hosting](#org6b61c72)
6.  [Contribution](#org65949fe)
7.  [License](#org20253d8)



<a id="orgadd4bf4"></a>

## Introduction

This project was made to personally help me manage my monthly expenses by being a system where daily expenses can be recorded and then later monitored to check where all the money is going.

Its features include ways to:

-   input daily expenses, with its categories and expense type (fixed, variable, investment, or income);
-   download all the expenses as .csv or .xlsx;
-   register recurring monthly expenses that are automatically save on the given day of the month;

A running instance of the project, together with [frontend code](https://github.com/miguel-faggioni/gastos-front), can be found on <https://anotar.coisa.online/>.


<a id="org986a32f"></a>

## Architecture

    /
    ├── .nvmrc - contains the version of node to be used in the project
    ├── ssl - .pem files for the SSL certificates
    ├── migration - files to create the needed tables on the database
    ├── cronjob.sh - shell script to run the cronjobs for the recurrent expenses
    ├── database.ts - database connection configuration
    ├── config
    │   ├── Database.ts - configuration for typeORM
    │   ├── Logger.ts - logger setup
    │   ├── Queries.sql - SQL queries to create the needed tables for cronjobs on the database
    │   ├── Router.ts - configuration of all base routes
    │   └── Server.ts - setup for the server
    └── app
        ├── controllers - funtions that actually do what the endpoint is supposed to do
        ├── middlewares - functions to check conditions before passing to the controllers
        ├── models - definitions of the classes and respective tables
        ├── repository - functions to access the database tables
        ├── routes - individual endpoints for each base route
        ├── schemas - schemas to validate received request bodies
        └── services - functions to ease the access to the database


<a id="org499df02"></a>

## Installing and running the project

After cloning the repository, install the needed packages with:

    yarn

In order to connect to the local environment, the `database.local.ts` file must be created, and for the production environment, the `database.aws.ts`. When running the server, it looks for the connection configuration on `database.ts`, so link it with `ln -sfn database.aws.ts database.ts` before running.

Create `database.aws.ts`, and `database.local.ts` with the following format:

    const PRODUCTION_CONFIGURATION = {
      DB: <database name>,
      USER_DB: <database username>,
      PASSWORD: <database password>,
      PORT_DB: <database port>,
      SERVER: <database server url>,
      SECRET: <secret key to be used to sign the JWT>,
    };
    
    export const SERVERNAME = <folder inside ./ssl where the SSL certificate files are to be found>;
    export const DATABASE_CONFIGURATION = PRODUCTION_CONFIGURATION;

Create the tables on the database:

    yarn migration:prod:run

This will run the files on `migration/prod` on the database configured on `database.aws.ts`. Then the `config/Queries.sql` must be run on the server to create the structure for running cronjobs on AWS.

Then to run the project locally run:

    yarn dev

This will make the system available on <https://localhost:5001/> with a self-signed SSL certificate.


<a id="org3112783"></a>

## How to use

(very very basic) Documentation for the endpoints can be found on <https://documenter.getpostman.com/view/5613876/TWDXoGUf>


<a id="org6b61c72"></a>

## Self-hosting

In order to build and deploy when self-hosting, some scripts on `package.json` must be updated:

-   `deploy`
    -   change `suave:~/gestao-de-gastos` to the correct host name and folder to deploy to
-   `postdeploy`
    -   change `suave` to the correct host name
    -   change `letsencrypt/work/live/api.coisa.online` to the folder where the SSL certificates are stored
    -   change `gestao-de-gastos` to the folder where the code was deployed
    -   remove `&& ln -sfn database.aws+local.ts database.ts`

Then to build and deploy the code, run:

    yarn build
    yarn deploy


<a id="org65949fe"></a>

## Contribution

Any type of contribution is welcome, however since this is a side-project, I kindly ask of you to be patient in case there is any delay to respond to any issue or pull-request opened.


<a id="org20253d8"></a>

## License

Licensed under [GNU Affero General Public License v3](https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0))

