```bash
# script
docker-compose up --build
docker-compose down
docker compose up --watch

docker-compose exec app rm -rf node_modules
docker-compose exec app npm install
docker-compose exec app bash
docker-compose exec app sh
docker-compose exec app npm run build
docker exec -it nest-app-dev npm run build


```