import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");
const airdroprequest = async () => {
  try {
    const tx = await connection.requestAirdrop(
      keypair.publicKey,
      LAMPORTS_PER_SOL * 2
    );
    console.log(`Success! Check out your TX here:
            https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
};

airdroprequest();
