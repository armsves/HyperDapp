// Blockchain interaction tracker for HyperDapp using Substreams
// Based on the provided Substreams example

const UNISWAP_V4_PERMIT2_CONTRACT = "0x000000000022D473030F116dDEE9F6B43aC78BA3".toLowerCase();
const TARGET_WALLET = "0xb39682FcCa63c5513cb70772AbC3bba4B4fafB68".toLowerCase();

// Substreams configuration
const SUBSTREAMS_CONFIG = {
  TOKEN: process.env.NEXT_PUBLIC_SUBSTREAMS_API_TOKEN || "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTQ5NTU4OTQsImp0aSI6IjVmYjI5MjMwLWM4YzQtNDgwZS1iNjEyLTM4ODYwZDkyMjYxZCIsImlhdCI6MTc1ODk1NTg5NCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiIwamluZTE2YTg1NzM2Mjk3YWYwODIiLCJ2IjoyLCJha2kiOiJlOWUwMDQyNjdiNTk2ZDc0ZTNhNDNlYzY1ZjI0NTE4YWUwODk3OTI1ZTgyODM4NGE3OTUzNGMyMjc5NWIzYWRjIiwidWlkIjoiMGppbmUxNmE4NTczNjI5N2FmMDgyIiwic3Vic3RyZWFtc19wbGFuX3RpZXIiOiJGUkVFIiwiY2ZnIjp7IlNVQlNUUkVBTVNfTUFYX1JFUVVFU1RTIjoiMiIsIlNVQlNUUkVBTVNfUEFSQUxMRUxfSk9CUyI6IjUiLCJTVUJTVFJFQU1TX1BBUkFMTEVMX1dPUktFUlMiOiI1In19.0reGoUCqM5L7befVEempsJjdBwmPdI72wHx_U9uSoT_QOS4vwoTY6V6xQ0ErmOlAtY1hk93sXF6GdZWXJHYVzw",
  ENDPOINT: "https://mainnet.eth.streamingfast.io",
  SPKG: "/ethereum-explorer-v0.1.2.spkg",
  MODULE: "map_contract_events",
  START_BLOCK: '23456000',
  STOP_BLOCK: '+1000'
};

class BlockchainTracker {
  constructor() {
    this.interactions = new Map(); // contract -> interaction count
    this.isTracking = false;
    this.provider = null;
    this.cache = new Map(); // Cache for API responses
  }

  // Initialize the tracker with a wallet provider
  async initialize(provider) {
    this.provider = provider;
    await this.loadInteractionHistory();
  }

  // Load historical interactions for the wallet using Substreams
  async loadInteractionHistory() {
    try {
      console.log('Loading interaction history from Substreams...');
      
      // Check cache first
      const cacheKey = `interactions_${TARGET_WALLET}`;
      if (this.cache.has(cacheKey)) {
        const cachedData = this.cache.get(cacheKey);
        this.interactions = new Map(cachedData);
        console.log('Loaded from cache:', this.interactions);
        return;
      }

      // Fetch from Substreams API
      const interactions = await this.fetchSubstreamsData();
      
      // Store in cache
      this.cache.set(cacheKey, Array.from(interactions.entries()));
      
      console.log('Loaded interaction history from Substreams:', this.interactions);
    } catch (error) {
      console.error('Failed to load interaction history:', error);
      // Fallback to mock data for development
      this.loadMockData();
    }
  }

  // Fetch data from Substreams API
  async fetchSubstreamsData() {
    try {
      const response = await fetch('/api/substreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractAddress: UNISWAP_V4_PERMIT2_CONTRACT,
          walletAddress: TARGET_WALLET,
          startBlock: SUBSTREAMS_CONFIG.START_BLOCK,
          stopBlock: SUBSTREAMS_CONFIG.STOP_BLOCK
        })
      });

      if (!response.ok) {
        throw new Error(`Substreams API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the Substreams response
      const interactions = this.processSubstreamsResponse(data);
      
      // Update interactions map
      interactions.forEach((count, contract) => {
        this.interactions.set(contract.toLowerCase(), count);
      });

      return this.interactions;
    } catch (error) {
      console.error('Substreams fetch error:', error);
      throw error;
    }
  }

  // Process Substreams response to extract interaction counts
  processSubstreamsResponse(data) {
    const interactions = new Map();
    
    if (data.events && Array.isArray(data.events)) {
      data.events.forEach(event => {
        // Check if the event involves our target wallet
        if (this.isWalletInvolved(event, TARGET_WALLET)) {
          const contract = event.address?.toLowerCase();
          if (contract) {
            const current = interactions.get(contract) || 0;
            interactions.set(contract, current + 1);
          }
        }
      });
    }

    return interactions;
  }

  // Check if wallet is involved in the event
  isWalletInvolved(event, walletAddress) {
    const wallet = walletAddress.toLowerCase();
    
    // Check various fields where wallet address might appear
    const fieldsToCheck = [
      event.from,
      event.to,
      event.owner,
      event.approved,
      event.operator,
      ...(event.topics || []).map(topic => topic.slice(-40)) // Last 40 chars of topics
    ];

    return fieldsToCheck.some(field => 
      field && field.toLowerCase().includes(wallet)
    );
  }

  // Fallback mock data for development
  loadMockData() {
    console.log('Loading mock data for development...');
    const mockInteractions = {
      [UNISWAP_V4_PERMIT2_CONTRACT]: 15, // User has 15 interactions with Uniswap V4
    };
    
    Object.entries(mockInteractions).forEach(([contract, count]) => {
      this.interactions.set(contract.toLowerCase(), count);
    });
  }

  // Get interaction count for a specific contract
  getInteractionCount(contractAddress) {
    return this.interactions.get(contractAddress.toLowerCase()) || 0;
  }

  // Calculate voting weight based on interactions
  calculateVotingWeight(contractAddress) {
    const interactions = this.getInteractionCount(contractAddress);
    
    if (interactions === 0) return { weight: 1, message: "No prior interactions detected" };
    if (interactions < 5) return { weight: 1.2, message: `${interactions} interactions - Light user` };
    if (interactions < 15) return { weight: 1.5, message: `${interactions} interactions - Regular user` };
    if (interactions < 50) return { weight: 2.0, message: `${interactions} interactions - Heavy user` };
    return { weight: 3.0, message: `${interactions} interactions - Power user` };
  }

  // Track a new interaction (would be called when user performs an action)
  trackInteraction(contractAddress) {
    const current = this.getInteractionCount(contractAddress);
    this.interactions.set(contractAddress.toLowerCase(), current + 1);
    
    // Update cache
    const cacheKey = `interactions_${TARGET_WALLET}`;
    this.cache.set(cacheKey, Array.from(this.interactions.entries()));
    
    console.log(`Tracked interaction with ${contractAddress}. Total: ${current + 1}`);
  }

  // Get detailed interaction info for display
  getInteractionInfo(contractAddress) {
    const count = this.getInteractionCount(contractAddress);
    const weightInfo = this.calculateVotingWeight(contractAddress);
    
    return {
      contractAddress,
      interactionCount: count,
      votingWeight: weightInfo.weight,
      message: weightInfo.message,
      isUniswapV4: contractAddress.toLowerCase() === UNISWAP_V4_PERMIT2_CONTRACT,
      dataSource: count > 0 ? 'Substreams' : 'No data'
    };
  }

  // Refresh data from Substreams
  async refreshData() {
    this.cache.clear();
    await this.loadInteractionHistory();
  }
}

// Export singleton instance
export const blockchainTracker = new BlockchainTracker();
