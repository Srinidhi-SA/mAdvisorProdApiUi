rsync -r * API_DOCKER/code/mAdvisor-api/ --exclude API_DOCKER --exclude copyApiFolder.sh --exclude buildspec.yml --exclude hadoop_docker --exclude NGINX_DOCKER --exclude copyHadoopImage.sh --exclude requirements
cp -r requirements API_DOCKER/requirements/
rm -r NGINX_DOCKER_OLD_PROD/static/static
rm API_DOCKER/all_apps.json
cp -r static NGINX_DOCKER_OLD_PROD/static/
cp all_apps.json API_DOCKER/
cd API_DOCKER
docker build -t $REPOSITORY_URI_API:latest .
docker tag $REPOSITORY_URI_API:latest $REPOSITORY_URI_API:$IMAGE_TAG_API
$(aws ecr get-login --region us-east-2 --no-include-email) 
docker push $REPOSITORY_URI_API:$IMAGE_TAG_API
cd ..
