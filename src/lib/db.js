import { supabase } from "./supabase";

async function createUser(id, email, username) {
  const { data: walletData } = await supabase.from("wallets").insert({ local: 1500, bitcoin: 500, ethereum: 250 }).select("walletId").single();
  const walletId = walletData.walletId;

  const { data: userData, error } = await supabase
    .from("users")
    .insert({ userAuthId: id, userEmail: email, userUsername: username, userWalletId: walletId })
    .select("userId")
    .single();
  if (error) {
    console.error("Error creating user", error);
  }
  const userId = userData.userId;

  await supabase.from("wallets").update({ walletUserId: userId }).eq("walletId", walletId);
}

async function getEmail(username) {
  const { data, error } = await supabase.from("users").select("userEmail").eq("userUsername", username).single();
  if (error) {
    return { error: true, message: "User does not exist. Please create an account.", data: null };
  }
  return { error: false, message: "Email retrieved", data: data.userEmail };
}

async function fetchUser(username) {
  const { data, error } = await supabase.from("users").select("*").eq("userUsername", username);
  if (error) {
    console.error("Error getting user", error);
  }
  return data[0];
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

async function getDailyDepositLimit(authId) {
  const { data, error } = await supabase.from("users").select("dailyDepositLimit").eq("userAuthId", authId).single();
  if (error) {
    console.error("Error getting daily deposit limit", error);
  }
  return data.dailyDepositLimit;
}

async function updateDailyDepositLimit(authId, limit) {
  const { data, error } = await supabase.from("users").update({ dailyDepositLimit: limit }).eq("userAuthId", authId);
  if (error) {
    console.error("Error updating daily deposit limit", error);
  }
}

async function getLastDepositTime(authId) {
  const { data, error } = await supabase.from("users").select("lastDepositTime").eq("userAuthId", authId).single();
  if (error) {
    console.error("Error getting last deposit time", error);
  }
  return data.lastDepositTime;
}

async function updateLastDepositTime(authId) {
  const { data, error } = await supabase.from("users").update({ lastDepositTime: new Date() }).eq("userAuthId", authId);
  if (error) {
    console.error("Error updating last deposit time", error);
  }
}

module.exports = {
  createUser,
  getEmail,
  fetchWallet: fetchWalletDb,
  fetchUser,
  updateWallet: updateWalletDb,
  updateWalletType,
  getDailyDepositLimit,
  updateDailyDepositLimit,
  getLastDepositTime,
  updateLastDepositTime,
};
