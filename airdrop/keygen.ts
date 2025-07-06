import { Keypair } from "@solana/web3.js";

let kp = Keypair.generate();
console.log(
  `You have Generated a new Solana Wallet:${kp.publicKey.toBase58()}`
);
console.log(`The Private Key is ${kp.secretKey}`);
