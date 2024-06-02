import { create } from "zustand";
import { fetchWallet, updateWallet, updateWalletType } from "@/lib/db";

import useAuthStore from "@/stores/useAuthStore";

function roundedWallet(wallet) {
  const updatedWallet = {};
  for (const [key, value] of Object.entries(wallet)) {
    if (typeof value === "number") {
      let val = value > 0 ? value : 0;
      val = parseFloat(value).toFixed(2);
      updatedWallet[key] = val;
    }
  }
  return updatedWallet;
}

const useUserStore = create((set) => ({
  wallet: {},
  currentWalletType: "local",
  fetchWallet: async () => {
    const wallet = await fetchWallet(useAuthStore.getState().user.userId, useAuthStore.getState().currentWalletType);
    const updatedWallet = roundedWallet(wallet);
    set({ wallet: updatedWallet, currentWalletType: wallet.walletType });
  },
  setWallet: async (wallet) => {
    const updatedWallet = roundedWallet(wallet);
    await updateWallet(useAuthStore.getState().user.userId, updatedWallet);
    set({ wallet: updatedWallet });
  },
  setCurrentWalletType: async (type) => {
    await updateWalletType(useAuthStore.getState().user.userId, type);
    set({ currentWalletType: type });
  },
}));

export default useUserStore;
