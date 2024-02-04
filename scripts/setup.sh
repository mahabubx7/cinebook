#!/usr/bin/env sh

# Setup PostGIS Extension
echo "Installing PostGIS extension..."
docker exec postgresql-db psql -U postgres -d cinebook -c "CREATE EXTENSION postgis;"
echo "PostGIS installed!"
docker exec postgresql-db psql -U postgres -d cinebook -c "GRANT TRUNCATE ON TABLE spatial_ref_sys TO developer;"
echo "PostGIS permissions granted!"
