import { supabase } from "./supabase";

async function createUser(id, email, username) {
  const { data: walletData } = await supabase.from("wallets").insert({ local: 1500, bitcoin: 500, ethereum: 250 }).select("walletId").single();
  const walletId = walletData.walletId;

  const { data: userData } = await supabase
    .from("users")
    .upsert({ userAuthId: id, userEmail: email, userUsername: username, userWalletId: walletId })
    .select("userId")
    .single();
  const userId = userData.userId;

  await supabase.from("wallets").update({ walletUserId: userId }).eq("walletId", walletId);
}

async function getEmail(username) {
  const { data, error } = await supabase.from("users").select("userEmail").eq("userUsername", username).single();
  if (error) {
    console.error("Error getting email", error);
  }
  return data.userEmail;
}

async function fetchUser(username) {
  const { data, error } = await supabase.from("users").select("*").eq("userUsername", username).single();
  if (error) {
    console.error("Error getting user", error);
  }
  return data;
}

async function fetchWalletDb(userId) {
  const { data, error } = await supabase.from("wallets").select("local, bitcoin, ethereum, walletType").eq("walletUserId", userId).single();
  if (error) {
    console.error("Error getting wallet", error);
  }
  return data;
}

async function updateWalletDb(userId, wallet) {
  const { data, error } = await supabase
    .from("wallets")
    .update({ local: wallet.local, bitcoin: wallet.bitcoin, ethereum: wallet.ethereum })
    .eq("walletUserId", userId);
  if (error) {
    console.error("Error updating wallet", error);
  }
}

async function updateWalletType(userId, walletType) {
  const { data, error } = await supabase.from("wallets").update({ walletType }).eq("walletUserId", userId);
  if (error) {
    console.error("Error updating wallet type", error);
  }
}

module.exports = { createUser, getEmail, fetchWallet: fetchWalletDb, fetchUser, updateWallet: updateWalletDb, updateWalletType };
