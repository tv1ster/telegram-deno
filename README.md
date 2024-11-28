# Telegram Bot Template for Deno Deploy

A production-ready Telegram bot template built with Deno, designed to be deployed on Deno Deploy. This template includes webhook support, user handling, and uses Deno KV for data storage.

## Features

- 🚀 Ready for Deno Deploy
- 💾 Deno KV for data persistence
- 🔄 Webhook support for production
- 🧪 Development mode with long polling
- 👥 User handling system
- ⌨️ Inline keyboard support
- 🔐 Secure webhook configuration
- 🌍 Environment variable management

## Prerequisites

- [Deno](https://deno.land/) installed on your machine
- A Telegram Bot Token from [BotFather](https://t.me/botfather)

## Setup

1. Clone this repository:
```bash
git clone <repository-url>
cd telegram-bot-sample
```

2. Copy the environment variables file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
WEBHOOK_SECRET_TOKEN=your_webhook_secret_here
DENO_ENV=development
```

## Development

Run the bot in development mode:

```bash
deno task start
```

In development mode, the bot uses long polling to receive updates, which is ideal for local development and testing.

## Project Structure

```
├── .env.example          # Example environment variables
├── deno.json            # Deno configuration and scripts
├── main.ts              # Main bot logic and webhook handling
├── db.ts               # Database operations using Deno KV
├── types.ts            # TypeScript type definitions
└── handlers/
    └── users.ts        # User management logic
```

## Deployment

This bot is configured for deployment on [Deno Deploy](https://deno.com/deploy). When deployed:

1. Set the following environment variables in your Deno Deploy project:
    - `TELEGRAM_BOT_TOKEN`
    - `WEBHOOK_SECRET_TOKEN`
    - `DENO_ENV=production`

2. Update the `WEBHOOK_URL` in `main.ts` to your Deno Deploy project URL.

3. Deploy your project to Deno Deploy.

4. The bot will automatically set up the webhook with Telegram's API using your configured secret token.

## Security

- Webhook endpoints are protected with a secret token
- Environment variables are used for sensitive data
- Production mode uses secure webhooks
- Development mode uses local polling

## Commands

The bot comes with the following default commands:
- `/start` - Initializes the bot and shows the main menu

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
