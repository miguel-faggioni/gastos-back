#!/bin/sh

current_dir=$(dirname -- "$0")

psql "\
host=$( cat ${current_dir}/database.js | grep -oP "(?<= SERVER: ').*(?=',)" ) \
port=$( cat ${current_dir}/database.js | grep -oP "(?<= PORT_DB: ).*(?=,)" ) \
dbname=$( cat ${current_dir}/database.js | grep -oP "(?<= DB: ').*(?=',)" ) \
user=$( cat ${current_dir}/database.js | grep -oP "(?<= USER_DB: ').*(?=',)" ) \
password=$( cat ${current_dir}/database.js | grep -oP "(?<= PASSWORD: ').*(?=',)" )\
" -c 'CALL run();'
