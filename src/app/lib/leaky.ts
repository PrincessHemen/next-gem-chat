import { LeakyBucket } from './leakyBucket';

// Initialize the Leaky Bucket instance with 10 requests per minute
const rateLimitPerMinute = 10;
const refillRate = 1;
const leakyBucket = new LeakyBucket(rateLimitPerMinute, refillRate);

// Export the callApi function that respects the leaky bucket limit
export async function callApi(endpoint: string, method: string = 'GET', body?: any) {
  try {
    const response = await leakyBucket.queueApiCall(endpoint, method, body);
    return response;
  } catch (error) {
    console.error("Error with API call:", error);
    throw error;
  }
}
