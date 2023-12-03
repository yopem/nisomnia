#!/bin/bash

docker exec -t postgres_container pg_dumpall -c -U postgres | gzip >/var/bkp/database/backup_$(date +"%Y-%m-%d_%H_%M_%S").gz
