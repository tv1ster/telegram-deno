export interface UserData {
  user_id: number;
  is_bot: boolean;
  first_name: string | undefined;
  username: string | undefined;
  language_code: string;
  is_premium: boolean;
  chat_id: number;
}
