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

1. To top up your testnet account with funds: 
```
aptos account fund-with-faucet --profile <profile> --amount 1500000000
// note: in this example replace <profile> by testnet
```

## Compile and publish the package 
### (all the modules *.move inside the sources folder)  

1. Compile
   
```
aptos move compile
```

2. Ensure your configuration file (`config.yaml`) looks like this:  
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

3. Run the following command in the terminal, specifying the profile you want to use (`testnet` in this example):  
   ```bash
   aptos move publish --network testnet --profile testnet
   ```  

This will top up your account and publish the necessary modules to the testnet network.  

## The exercise

1. Create a script to find a valid nonce for these three scenarios based on the difficulty (determined by the number of leading zeros in the prefix).

``` Please read the comments in the module proofOfWork.move to get a better understanding, this constants below are crucial to undertand why the number of leading ceros for each difficulty ```

```
    const CHALLENGE: vector<u8> = b"Find the nonce!!";
    //  Difficulty 2 is being mapped to 4 leading zeros in the hash 
    //(equivalent to 2 bytes of zeros = 16 bits).
    const EASY_DIFFICULTY: u64 = 2;

    //  Difficulty 3 is being mapped to 6 leading zeros in the hash
    // (6 leading ceros X 4 = 24 bits = 3 bytes) 
    const NORMAL_DIFFICULTY: u64 = 3;

    //  Difficulty 4 is being mapped to 8 leading zeros in the hash 
    // (8 leading ceros X 4 = 31 bits = 4 bytes) 
    const HARD_DIFFICULTY: u64 = 4;
```

## Test the finished exercise. Find a Nonce  

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
