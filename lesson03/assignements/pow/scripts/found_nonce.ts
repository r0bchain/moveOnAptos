// main.ts
import { createHash } from "crypto";
import { Worker } from 'worker_threads';
import { Account, Aptos, AptosConfig, Ed25519Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import * as path from 'path';

// Setup the client
const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
const privateKeyHex = process.env.PRIVATE_KEY || '0x00';

if (!privateKeyHex || privateKeyHex.length === 0) {
  throw new Error(
    "PRIVATE_KEY_HEX is not defined in environment variables."
  );
}

const sender = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(privateKeyHex),
 });


const numCPUs = require('os').cpus().length;

const EASY_DIFFICULTY = 2;
const NORMAL_DIFFICULTY = 3;
const HARD_DIFFICULTY = 4;



class NonceMiners {
    private workers: Worker[] = [];
    private readonly text = "Find the nonce!!";
    private startTime: number;
    private currentRound: number = 0;

    
    constructor(
        private totalWorkers: number,
        //private targetZeros: number = 6,
        private targetZeros: number,
    ) {
        this.startTime = Date.now();
    }


    private distributeRanges() {
        const rangeSize = 10000000; // 10 million nonces per range
        let activeWorkers = this.totalWorkers; // Track active workers

        for (let i = 0; i < this.totalWorkers; i++) {
            const start: number = (this.currentRound * this.totalWorkers * rangeSize) + (i * rangeSize);

           // const start = i * rangeSize;
            const end: number = start + rangeSize;
            
            // const worker = new Worker('worker.js');
            const worker = new Worker(path.resolve(__dirname, 'worker.js')); // Absolute path
            
            worker.on('error', (error) => {
                console.error('\nWorker error:', error);
            });

            worker.on('message',async (data) => {
                const { nonce, hash, type } = data;
               // console.log(`\n******currenty status type: ${type}****** WORKER ${i} runnig...`);
                if (type === 'found') {
                    console.log('\nSolution found! 🎉');
                    console.log(`Nonce: ${nonce}`);
                    console.log(`Hash: ${hash}`);
                    console.log(`Time taken: ${(Date.now() - this.startTime) / 1000} seconds`);
                    
                    // Verify the solution
                    const verifyHash = this.calculateHash(nonce);
                    console.log(`Verification: ${verifyHash === hash ? 'VALID ✅' : 'INVALID ❌'}`);
                    
                    // Call verify_proof 0x693ead2bcaddbc1643efbf1328dec691ba57ca814784d63aa4a82678ef4e441a::robPow::
                    if(verifyHash === hash) {
                        // 0x693ead2bcaddbc1643efbf1328dec691ba57ca814784d63aa4a82678ef4e441a::powRob::proof_of_hard_work   
                      

                        await this.getStatus(nonce, 'get_easy_solved_status').then( (statusEasyWork) => {

                            console.log(`\nget_easy_solved_status check: `, statusEasyWork);
                        })

                        await this.getStatus(nonce, 'get_normal_solved_status').then((statusNormalWork) => {

                            console.log(`\nget_normal_solved_status check: `, statusNormalWork);
                        })
                        

                        await this.getStatus(nonce, 'get_hard_solved_status').then( (statusHardWork) => {
                            console.log(`\nget_hard_solved_status: `, statusHardWork);

                        });


                        let difficulty = 'easy'; // default value
                        if(this.targetZeros == 6) {
                            difficulty = 'normal'
                        } else if (this.targetZeros == 8) {
                            difficulty = 'hard';
                        }

                        await this.getProofOfWork(sender, nonce, difficulty).then( (proofOfWork) => {

                            console.log(`\nproof_of_${difficulty}_work check: `, proofOfWork);
                        })
                    
                    }
                    
                    this.stopAllWorkers();
                } else if (type === 'progress') {
                    console.group(`\nin progress...`);

                    process.stdout.write(`\rTesting nonce: ${nonce.toLocaleString()}`);
                } 
                

                else if (type === 'complete') {
                    activeWorkers--;
                    
                    if (activeWorkers === 0) {
                        console.group(`\nRound ${this.currentRound}`);
                        console.log(`status: completed`);
                        console.log(`***Starting next round***`);
                        console.log(`******************************************************`);
                        this.currentRound++;
                        this.stopAllWorkers();
                        this.distributeRanges(); // Start new round with new ranges
                    }
                }
            });
            
            worker.postMessage({
                start,
                end,
                text: this.text,
                targetZeros: this.targetZeros,
            });

            this.workers.push(worker);
            
            console.log(`\nStarted worker ${i + 1} with range: ${start.toLocaleString()} - ${end.toLocaleString()}`);
        }
    }
    
    private calculateHash(nonce: number): string {
        if(this.targetZeros != 6) {
         return createHash('sha256').update(this.text + nonce).digest('hex');
        } else {


            const text_hash = createHash('sha256').update(this.text).digest();
            const nonce_hash = createHash('sha256').update(nonce.toString()).digest();
           // hash = createHash('sha256').update(text_hash + nonce_hash).digest('hex');
            return createHash('sha256')
            .update(Buffer.concat([text_hash, nonce_hash]))
            .digest('hex');
            
        }    
    }
    
    start() {
      
        console.log(`Number of CPU cores: ${numCPUs}`);
        console.log(`Starting ${this.totalWorkers} workers to find hash with ${this.targetZeros} leading zeros`);
        console.log(`Text to hash: "${this.text}"`);
        this.distributeRanges();
    }
    
    private stopAllWorkers() {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
    }
      

    private  getProofOfWork = async(sender: Ed25519Account, nonce: number | bigint, difficulty: String) => {
        await aptos.transaction.build.simple({
            sender: sender.accountAddress,
            data: {
                function:
                  `0x693ead2bcaddbc1643efbf1328dec691ba57ca814784d63aa4a82678ef4e441a::powRob::proof_of_${difficulty}_work`,
                functionArguments: [nonce.toString()],
            },
        
          }).then( (result) => {
            console.log('result', result);
          }).catch( (error) => {
            console.log('error PW', error);
          });
    }

    private getStatus = async(nonce: number | bigint, getStatusFn: string) => {
        await aptos.view({
            payload: {
              function:
                `0x693ead2bcaddbc1643efbf1328dec691ba57ca814784d63aa4a82678ef4e441a::powRob::${getStatusFn}`,
            },
          }).then( (result) => {
            console.log('result', result[0]);
          }).catch(error => {
            console.log('error PW', error);
          });
    }  
}


const args = process.argv.slice(2);
console.log('Arguments:', args);

// Usage
const miners = new NonceMiners(numCPUs, Number(args[0])); // Use 12 workers
miners.start();