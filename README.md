## Development start

Server:
cd server && npm run build:watch
npx serverless offline start --stage production

## Deploy

Server:
cd server && npm run build:wp
npx serverless deploy --aws-profile default
