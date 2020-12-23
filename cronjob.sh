#!/bin/sh

psql "\
host=$( cat database.ts | grep -oP "(?<= SERVER: ').*(?=',)" ) \
port=$( cat database.ts | grep -oP "(?<= PORT_DB: ).*(?=,)" ) \
dbname=$( cat database.ts | grep -oP "(?<= DB: ').*(?=',)" ) \
user=$( cat database.ts | grep -oP "(?<= USER_DB: ').*(?=',)" ) \
password=$( cat database.ts | grep -oP "(?<= PASSWORD: ').*(?=',)" )\
" -c 'CALL run()'
