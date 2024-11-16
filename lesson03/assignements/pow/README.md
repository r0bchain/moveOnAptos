``Proof of Work exercise`` 
```markdown
# Proof of Work Exercise  

This exercise demonstrates the proof-of-work operations. Follow the steps below to get started.  

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

This file is clean, organized, and provides clear instructions for users to follow. Let me know if you need further modifications!
