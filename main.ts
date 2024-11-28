// @deno-types="@types/node-telegram-bot-api"
import TelegramBot from "node-telegram-bot-api";
import { handleNewUser } from "./handlers/users.ts";

// Get tokens from environment variables
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const WEBHOOK_SECRET_TOKEN = Deno.env.get("WEBHOOK_SECRET_TOKEN");
const IN_DEV_MODE = Deno.env.get("DENO_ENV") === "development";
const WEBHOOK_URL = "";

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
}

if (!WEBHOOK_SECRET_TOKEN) {
  throw new Error("WEBHOOK_SECRET_TOKEN environment variable is not set");
}

// Initialize bot with webhook
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

if (IN_DEV_MODE) {
  await bot.deleteWebHook();
} else {
  await bot.setWebHook(`${WEBHOOK_URL}/webhook`, { secret_token: WEBHOOK_SECRET_TOKEN });
}

// Set bot commands
await bot.setMyCommands([
  { command: "/start", description: "Start" }
]);

async function handleUpdate(update: TelegramBot.Update) {
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const messageText = msg.text;

    if (!userId || !(await handleNewUser(bot, msg))) {
      return;
    }

    if (messageText === "/start") {
      bot.sendMessage(chatId, 'Welcome to bot', {
        reply_markup: {
          inline_keyboard: [[{
            text: 'Main',
            callback_data: 'main',
          }]],
        },
      });
    }
  } else if (update.callback_query) {
    const callbackQuery = update.callback_query;
    const chatId = callbackQuery.message?.chat.id;
    if (chatId && callbackQuery.data === 'main') {
      bot.sendMessage(chatId, 'You clicked on main');
    }
    bot.answerCallbackQuery(callbackQuery.id);
  }
}

if (IN_DEV_MODE) {
  let offset = 0;
  console.debug("Bot", "Starting bot in development mode using getUpdates");
  
  while (true) {
    try {
      const updates = await bot.getUpdates({
        offset,
        timeout: 30, // 30 seconds long polling
      });

      for (const update of updates) {
        // Process update
        try {
          await handleUpdate(update);
        } catch (error) {
          console.error("Update Handler", "Failed to process update", error);
        }
        // Update offset to acknowledge update
        offset = update.update_id + 1;
      }
    } catch (error) {
      console.error("GetUpdates", "Failed to get updates", error);
      // Wait a bit before retrying to avoid flooding in case of persistent errors
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
} else {
  // Start webhook server
  Deno.serve(async (req: Request) => {
    if (
      req.method === "POST" && req.url.includes("/webhook") &&
      req.headers.get("X-Telegram-Bot-Api-Secret-Token") === WEBHOOK_SECRET_TOKEN
    ) {
      try {
        const update = await req.json() as TelegramBot.Update;
        await handleUpdate(update);
        return new Response("OK", { status: 200 });
      } catch (error) {
        console.error("Webhook", "Failed to process update", error);
        return new Response("Error processing update", { status: 500 });
      }
    }
    return new Response("Not found", { status: 404 });
  });
}
