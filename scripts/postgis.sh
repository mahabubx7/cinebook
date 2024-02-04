#!/usr/bin/env sh

# echo "Installing PostGIS extension..."
# docker exec postgresql-db psql -U postgres -D cinebook -c "CREATE EXTENSION postgis;"

echo "Installing PostGIS extension in test database..."
docker exec postgresql-db psql -U postgres -d cinebook_test -c "CREATE EXTENSION postgis;"
echo "PostGIS installed!"
