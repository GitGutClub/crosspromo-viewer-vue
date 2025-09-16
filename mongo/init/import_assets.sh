#!/bin/bash
set -e
echo "Importing assets.json into MongoDB..."
mongoimport --db crosspromo_assets --collection appDynamicData --file /docker-entrypoint-initdb.d/assets.json --jsonArray
echo "Import complete."
