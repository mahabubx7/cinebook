#!/usr/bin/env sh

# Setup PostGIS Extension
echo "Installing PostGIS extension..."
docker exec postgresql-db psql -U postgres -d cinebook -c "CREATE EXTENSION postgis;"
echo "PostGIS installed!"
