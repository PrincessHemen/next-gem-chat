export class LeakyBucket {
    private capacity: number;
    private tokens: number;
    private refillRate: number;
    private lastRefill: number;
  
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
      this.lastRefill = now;
    }
  
    // Queue API call, respecting the leaky bucket rate limit
    async queueApiCall(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
      this.refillTokens();
  
      if (this.tokens > 0) {
        this.tokens--; // Consume a token
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : undefined,
        });
        return response.json();
      } else {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
    }
  }
  