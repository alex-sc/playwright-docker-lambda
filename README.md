# playwright-docker-lambda

# Build

```docker build -t com.github.alex-sc/playwright-docker .```

# Deploy

## AWS
### ECS
See https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html
- Create Elastic Container Registry
- `aws ecr create-repository --repository-name playwright-docker --region us-east-1`
- Tag the image
- `docker build -t 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker .`
- Authenticate Docker
- `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 175379499180.dkr.ecr.us-east-1.amazonaws.com`
- Push the image to Amazon ECR
- `docker push 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker`
- Create ECS cluster
- `aws ecs create-cluster --cluster-name playwright-docker`
- Create ECS service - to be continued
- `aws ecs create-service --cluster playwright-docker --service-name playwright-docker-service --desired-count 1`

### Lambda
- Create Elastic Container Registry
- `aws ecr create-repository --repository-name playwright-docker-lambda --region us-east-1`
- Build and tag the image
- `docker build -f Dockerfile-lambda -t 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda .`
- Push the image to Amazon ECR
- `docker push 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda`
- Create the lambda
- ...
- Update the lambda
- `aws lambda update-function-code --function-name wrfre --image-uri 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda:latest`


## GCP

### Cloud Run
To deploy from source using Cloud Build

```gcloud run deploy --memory=1024Mi```
See https://cloud.google.com/sdk/gcloud/reference/run/deploy for other options
