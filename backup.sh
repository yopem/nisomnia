#!/bin/bash

docker exec -t postgres pg_dumpall -c -U postgres | gzip > /var/backups/database/backup_$(date +"%Y-%m-%d_%H_%M_%S").gz
