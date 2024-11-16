``Proof of work exercise``
(credits to Jun from @Shardlab)

```markdown
# Proof of Work Exercise  

This exercise demonstrates how to use Aptos for proof-of-work operations. Follow the steps below to get started.  

---

## Initialize the Application  

1. Run the initialization command:  
   ```bash
   aptos init
   ```  

2. Select the network. For this exercise, we will use **testnet**.  

3. When prompted with:  
   ```
   Enter your private key as a hex literal
   ```  
   Add an existing account private key or press Enter to generate a new one.  

4. Verify your account configuration by checking the `config.yaml` file inside the hidden `.aptos` folder. This file contains the account details you just set up.  

---

## Install `ts-node`  

`ts-node` is required to run TypeScript scripts in this exercise. Follow these steps to install it:  

1. Make sure you have Node.js installed. If not, download and install it from [Node.js official website](https://nodejs.org/).  

2. Install `ts-node` globally using npm:  
   ```bash
   npm install -g ts-node
   ```  

3. Verify the installation by running:  
   ```bash
   ts-node --version
   ```  

---

## Top Up Your Testnet Account  

To top up your testnet account with funds:  

1. Ensure your configuration file (`config.yaml`) looks like this:  
   ```yaml
   ---
   profiles:
     testnet:
       network: Testnet
       private_key: "0xd0000000000000000000000"
       public_key: "0x340000000000000000000000"
       account: 647584000000000000000000
       rest_url: "https://fullnode.testnet.aptoslabs.com"
       faucet_url: "https://faucet.testnet.aptoslabs.com"
   ```  

2. Run the following command in the terminal, specifying the profile you want to use (`testnet` in this example):  
   ```bash
   aptos move publish --network testnet --profile testnet
   ```  

This will top up your account and publish the necessary modules to the testnet network.  

---

## Find a Nonce  

To complete the proof-of-work exercise, you will run a script to find a valid nonce.  

1. Navigate to the `scripts` folder.  

2. Run the `found_nonce.ts` script using the following syntax:  
   ```bash
   ts-node test/found_nonce.ts <difficulty>
   ```  
   Replace `<difficulty>` with the desired difficulty level:  
   - `2` for an easy nonce  
   - `6` for a normal nonce  
   - `8` for a hard nonce  

3. The script will output one or more valid nonce values depending on the difficulty level selected.  

Example:  
```bash
ts-node test/found_nonce.ts 6
```  

This command searches for a valid nonce with a difficulty level of 6.  

---

## Additional Notes  

- Ensure you have the necessary dependencies installed, including `ts-node` and any required packages for the scripts.  
- The generated nonce(s) can be used in further proof-of-work operations as needed.  

---  

Happy coding! 🚀  
```  
