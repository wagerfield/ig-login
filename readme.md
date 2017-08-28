## Setup

Install the project dependencies:

```bash
npm install
```

Create a `.env` file at the root of the repository and paste the following:

```
LIVE_API_KEY=liveApiKey
LIVE_USERNAME=liveAccountUsername
LIVE_PASSWORD=liveAccountPassword

DEMO_API_KEY=demoApiKey
DEMO_USERNAME=demoAccountUsername
DEMO_PASSWORD=demoAccountPassword
```

Replace the placeholder credentials with your own.

## Testing

To run the tests once:

```bash
npm run test
```

To run the tests during development:

```bash
npm run test:watch
```
