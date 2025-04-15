@echo off
echo Waiting for MongoDB to be ready...
timeout /t 15 /nobreak

echo Running database seeder...
docker exec foodin-backend npm run seed

echo Done! 