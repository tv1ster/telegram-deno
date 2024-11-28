// @deno-types="@types/node-telegram-bot-api"
import TelegramBot from "node-telegram-bot-api";
import { UserData } from "../types.ts";
import { 
  createUser,
  userExists,
} from "../db.ts";

export async function handleNewUser(
  bot: TelegramBot,
  msg: TelegramBot.Message
): Promise<boolean> {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  if (!userId) {
    return false;
  }

  const exists = await userExists(userId);
  const currentUserData: UserData = {
    user_id: userId,
    is_bot: msg.from?.is_bot ?? false,
    first_name: msg.from?.first_name,
    username: msg.from?.username,
    language_code: msg.from?.language_code ?? "en",
    // @ts-ignore
    is_premium: msg.from?.is_premium ?? false,
    chat_id: chatId,
  };

  try {
    if (!exists) {
      // Create new user
      await createUser(currentUserData);
      console.log("User Created", `New user registered: ${userId}`);
    }
    return true;
  } catch (error) {
    console.error("User Operation", "Failed to handle user data", error);
    bot.sendMessage(chatId, 'Oops! Something went wrong. Please try again later.');
    return false;
  }
}