up:
	docker compose -f infra/docker-compose.yml up -d
build:
	docker compose -f infra/docker-compose.yml up --build
down:
	docker compose -f infra/docker-compose.yml down 

