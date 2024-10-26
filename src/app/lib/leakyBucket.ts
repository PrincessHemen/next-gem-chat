// lib/leakyBucket.ts

export class LeakyBucket {
    private capacity: number;      // Maximum number of tokens
    private tokens: number;        // Current number of tokens
    private refillRate: number;    // Rate of token refill (tokens per minute)
    private lastRefill: number;    // Timestamp of the last refill

    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity;
        this.tokens = capacity; // Start with a full bucket
        this.refillRate = refillRate; // Tokens to add back per interval
        this.lastRefill = Date.now(); // Timestamp of last refill
    }

    // Method to refill tokens based on elapsed time since last call
    private refillTokens() {
        const now = Date.now();
        const timeElapsed = now - this.lastRefill;

        const tokensToAdd = Math.floor((timeElapsed / 60000) * this.refillRate); // refillRate tokens per minute
        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefill = now; // Update last refill time
    }

    // Public method to consume a token
    public consumeToken(): boolean {
        this.refillTokens(); // Refill tokens before checking
        if (this.tokens > 0) {
            this.tokens--; // Consume a token
            return true; // Token consumed successfully
        }
        return false; // No tokens available
    }

    // Optional: Public method to get current token count
    public getTokens(): number {
        this.refillTokens(); // Update token count before returning
        return this.tokens;
    }
}