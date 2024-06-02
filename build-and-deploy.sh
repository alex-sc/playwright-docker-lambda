docker build -f Dockerfile-lambda -t 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda . && \
  docker push 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda && \
  aws lambda update-function-code --function-name playwright-lambda --image-uri 175379499180.dkr.ecr.us-east-1.amazonaws.com/playwright-docker-lambda:latest
