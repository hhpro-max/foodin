@echo off
echo Starting Foodin Application...

echo Stopping any running containers...
docker-compose down

echo Building and starting containers...
docker-compose up --build

echo Application is running!
echo Frontend: http://localhost:3001
echo Backend API: http://localhost:5000
echo API Documentation: http://localhost:5000/api-docs 