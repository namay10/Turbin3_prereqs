import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./wallet.json";

const from_kp = Keypair.fromSecretKey(new Uint8Array(wallet));
const to_kp = new PublicKey("4YH9pgaC1a9Ff4m7Z1nCViExVLn9goV4ybqWEPaQxY27");

const connection = new Connection("https://api.devnet.solana.com");
const transfer = async () => {
  try {
    const balance = await connection.getBalance(from_kp.publicKey);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from_kp.publicKey,
        toPubkey: to_kp,
        lamports: LAMPORTS_PER_SOL * 0.1,
      })
    );
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = from_kp.publicKey;
    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;
    transaction.instructions.pop();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from_kp.publicKey,
        toPubkey: to_kp,
        lamports: balance - fee,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from_kp,
    ]);
    console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
};
transfer();
