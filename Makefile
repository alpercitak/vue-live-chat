serve:
	pnpm run serve

deploy:
	docker-compose up --remove-orphans --build

deploy-scaled:
	docker-compose up --remove-orphans --build --scale app-server=2

init:
	terraform init -upgrade

apply:
	terraform apply --auto-approve	

destroy:
	terraform destroy --auto-approve