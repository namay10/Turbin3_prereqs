import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Turbin3Prereq, IDL } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";
import bs58 from "bs58";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);
const wallet_base58 = bs58.decode(wallet);
const keypair = Keypair.fromSecretKey(wallet_base58);

const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const seeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];
const [account_key, account_bump] = PublicKey.findProgramAddressSync(
  seeds,
  program.programId
);

const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);
const mintTs = Keypair.generate();
const auth_seeds = [Buffer.from("collection"), mintCollection.toBuffer()];
const [auth_key, auth_bump] = PublicKey.findProgramAddressSync(
  auth_seeds,
  program.programId
);

/*const init = async () => {
  try {
    const txhash = await program.methods
      .initialize("namay10")
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        system_program: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();
    console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
};
init();*/

const submit_ts = async () => {
  try {
    const txhash = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        authority: auth_key,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SystemProgram.programId,
      })
      .signers([keypair, mintTs])
      .rpc();
    console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
};
submit_ts();
