import { create } from "zustand";
import { fetchWallet, updateWallet, updateWalletType, getDailyDepositLimit, updateDailyDepositLimit } from "@/lib/db";

import useAuthStore from "@/stores/useAuthStore";

function roundedWallet(wallet) {
  const updatedWallet = {};
  for (const [key, value] of Object.entries(wallet)) {
    let val = value > 0 ? value : 0;
    val = parseFloat(value).toFixed(2);
    updatedWallet[key] = val;
  }
  return updatedWallet;
}

const useUserStore = create((set) => ({
  wallet: {},
  currentWalletType: "local",
  fetchWallet: async () => {
    const wallet = await fetchWallet(useAuthStore.getState().user.userId);
    const updatedWallet = roundedWallet(wallet);
    set({ wallet: updatedWallet, currentWalletType: wallet.walletType });
  },
  setCurrentWalletType: async (type) => {
    await updateWalletType(useAuthStore.getState().user.userId, type);
    set({ currentWalletType: type });
  },
  transactWallet: async (amount, type = "transaction") => {
    if (type === "deposit") {
      const limit = await getDailyDepositLimit(useAuthStore.getState().user.userAuthId);
      if (amount <= limit) {
        await updateDailyDepositLimit(useAuthStore.getState().user.userId, limit - amount);
      } else {
        return;
      }
    }
    let wallet = { ...useUserStore.getState().wallet };
    for (let key in wallet) {
      wallet[key] = parseFloat(wallet[key]);
    }
    const walletType = useUserStore.getState().currentWalletType;
    wallet[walletType] += parseFloat(amount);
    const updatedWallet = roundedWallet(wallet);
    await updateWallet(useAuthStore.getState().user.userId, updatedWallet);
    set({ wallet: updatedWallet });
  },
  getCurrentAmount: () => {
    const type = useUserStore.getState().currentWalletType;
    return useUserStore.getState().wallet[type];
  },
}));

export default useUserStore;
