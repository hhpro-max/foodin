#!/bin/bash

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 10

# Run the seeder
docker exec foodin-backend npm run seed 