import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function WalletDialog() {
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lets deposit some money, shall we?</DialogTitle>
          <DialogDescription>Its easy to deposit money, just click the button below and go degen mode.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </>
  );
}
