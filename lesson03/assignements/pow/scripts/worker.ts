// worker.ts
import { createHash } from "crypto";
import { parentPort } from "worker_threads"; // Import parentPort

const encoder = new TextEncoder();


parentPort?.on('message', (event) => {
    const { start, end, text, targetZeros } = event;
    const target = '0'.repeat(targetZeros);
  
    for (let nonce = start; nonce < end; nonce++) {
        
        let hash = '';

        // Normal challenge, both the CHALLENGE and the nonce are hashed individually before being concatenated and hashed again.
        if(targetZeros == 6){
            const text_hash = createHash('sha256').update(text).digest();
            const nonce_hash = createHash('sha256').update(nonce.toString()).digest();
           // hash = createHash('sha256').update(text_hash + nonce_hash).digest('hex');
            hash = createHash('sha256')
            .update(Buffer.concat([text_hash, nonce_hash]))
            .digest('hex');
        }  else {
            // Easy and hard challenge.
            hash = createHash('sha256').update(text + nonce.toString()).digest('hex');
        }
        
        if (hash.startsWith(target)) {
            parentPort?.postMessage({ type: 'found', nonce, hash });
            return;
        }
        
        // Report progress every 1000000 nonces
        if (nonce % 1000000 === 0) {
            parentPort?.postMessage({ type: 'progress', nonce });
        }
    }
    
    // If we reach here, no solution was found in this range
    parentPort?.postMessage({ type: 'complete', rangeEnd: end });
});