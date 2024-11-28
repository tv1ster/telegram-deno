import type { UserData } from "./types.ts";

const kv = await Deno.openKv();

export async function createUser(userData: UserData): Promise<void> {
  const userKey = ["users", userData.user_id];
  await kv.set(userKey, userData);
}

export async function userExists(userId: number): Promise<boolean> {
  const userKey = ["users", userId];
  const result = await kv.get(userKey);
  return !!result.value;
}
