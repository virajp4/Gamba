import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";

async function createUser(id, email, username) {
  const { data } = await supabase.from("wallets").insert({ local: 0, bitcoin: 0, ethereum: 0 }).select("walletId").single();
  const { walletId } = data;

  const { error } = await supabase.from("users").upsert({ userAuthId: id, userEmail: email, userUsername: username, walletId });

  if (error) {
    console.error("Error upserting user:", error);
    return;
  }
}

async function getEmail(username) {
  const { data, error } = await supabase.from("users").select("userEmail").eq("userUsername", username).single();
  if (error) {
    console.error("Error getting email", error);
  }
  return data.userEmail;
}
module.exports = { createUser, getEmail };
