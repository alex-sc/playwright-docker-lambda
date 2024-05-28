FROM node:20-bookworm

### Playwright with Chromiun
RUN npx playwright@1.44.1 install --with-deps chromium

### Playwright app
WORKDIR /usr/app

# Install dependencies
COPY package.json .
RUN npm install

# Install app
COPY . .
RUN npm run build

# Export on port 8080
EXPOSE 8080

CMD ["npm", "run", "start"]
