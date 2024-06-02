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
- Create execution role for lambda (if needed)
- `aws iam create-role --role-name playwright-lambda-role --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}'`
- Create the lambda
- `aws lambda create-function --function-name playwright-lambda --timeout 300 --memory-size 1024 --publish --role arn:aws:iam::175379499180:role/playwright-lambda-role --code ImageUri=175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda:latest --package-type Image`
- Optionally, assign HTTP endpoint
- `aws lambda create-function-url-config --function-name playwright-lambda --auth-type NONE`
- and respective permissions
- `aws lambda add-permission --function-name playwright-lambda --statement-id FunctionURLAllowPublicAccess --action lambda:InvokeFunctionUrl --principal '*' --function-url-auth-type NONE`
- Update the lambda
- `aws lambda update-function-code --function-name playwright-lambda --image-uri 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda:latest`


## GCP

### Cloud Run
To deploy from source using Cloud Build

```gcloud run deploy --memory=1024Mi```
See https://cloud.google.com/sdk/gcloud/reference/run/deploy for other options
