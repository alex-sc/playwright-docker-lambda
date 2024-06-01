# playwright-docker-lambda

# Build

```docker build -t com.github.alex-sc/playwright-docker .```

# Deploy

## AWS
### ECS
See https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html
- Create Elastic Container Registry if you don't have one
- `aws ecr create-repository --repository-name playwright-docker --region us-east-1`
- Tag the image
- `docker tag com.github.alex-sc/playwright-docker 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker`
- Authenticate Docker
- `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 175379499180.dkr.ecr.us-east-1.amazonaws.com`
- Push the image to Amazon ECR
- `docker push 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker`

### Lambda
- Build and tag the image
- `docker build -f Dockerfile-lambda -t 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker .`
- Push the image to Amazon ECR
- `docker push 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker`


## GCP

### Cloud Run
To deploy from source using Cloud Build

```gcloud run deploy --memory=1024Mi```
See https://cloud.google.com/sdk/gcloud/reference/run/deploy for other options
