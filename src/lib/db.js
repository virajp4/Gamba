import { supabase } from "./supabase";

async function createUser(id, email, username) {
  await supabase.from("users").upsert({ userAuthId: id, userEmail: email, userUsername: username });
}

async function getEmail(username) {
  const { data, error } = await supabase.from("users").select("userEmail").eq("userUsername", username).single();

  if (error) {
    console.error("Error getting email", error);
  }
  return data.userEmail;
}
module.exports = { createUser, getEmail };
