// API route for Substreams integration
// This handles the Substreams API calls server-side

import { NextRequest, NextResponse } from 'next/server';

const SUBSTREAMS_CONFIG = {
  TOKEN: process.env.NEXT_PUBLIC_SUBSTREAMS_API_TOKEN || "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTQ5NTU4OTQsImp0aSI6IjVmYjI5MjMwLWM4YzQtNDgwZS1iNjEyLTM4ODYwZDkyMjYxZCIsImlhdCI6MTc1ODk1NTg5NCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiIwamluZTE2YTg1NzM2Mjk3YWYwODIiLCJ2IjoyLCJha2kiOiJlOWUwMDQyNjdiNTk2ZDc0ZTNhNDNlYzY1ZjI0NTE4YWUwODk3OTI1ZTgyODM4NGE3OTUzNGMyMjc5NWIzYWRjIiwidWlkIjoiMGppbmUxNmE4NTczNjI5N2FmMDgyIiwic3Vic3RyZWFtc19wbGFuX3RpZXIiOiJGUkVFIiwiY2ZnIjp7IlNVQlNUUkVBTVNfTUFYX1JFUVVFU1RTIjoiMiIsIlNVQlNUUkVBTVNfUEFSQUxMRUxfSk9CUyI6IjUiLCJTVUJTVFJFQU1TX1BBUkFMTEVMX1dPUktFUlMiOiI1In19.0reGoUCqM5L7befVEempsJjdBwmPdI72wHx_U9uSoT_QOS4vwoTY6V6xQ0ErmOlAtY1hk93sXF6GdZWXJHYVzw",
  ENDPOINT: "https://mainnet.eth.streamingfast.io",
  SPKG: "/ethereum-explorer-v0.1.2.spkg",
  MODULE: "map_contract_events"
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractAddress, walletAddress, startBlock, stopBlock } = body;

    if (!contractAddress || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters: contractAddress, walletAddress' },
        { status: 400 }
      );
    }

    console.log('Substreams API request:', {
      contractAddress,
      walletAddress,
      startBlock: startBlock || '23456000',
      stopBlock: stopBlock || '+1000'
    });

    // For now, return mock data that simulates Substreams response
    // In production, this would make actual Substreams API calls
    const mockResponse = await simulateSubstreamsResponse(contractAddress, walletAddress);

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Substreams API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Substreams data' },
      { status: 500 }
    );
  }
}

// Simulate Substreams response based on the provided example
async function simulateSubstreamsResponse(contractAddress: string, walletAddress: string) {
  // This simulates the response structure from the Substreams example
  const mockEvents = [
    {
      address: contractAddress.toLowerCase(),
      topics: [
        "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", // ApprovalForAll
        "0x000000000000000000000000" + walletAddress.slice(2), // owner
        "0x000000000000000000000000" + "0x1234567890123456789012345678901234567890".slice(2) // operator
      ],
      data: "0x0000000000000000000000000000000000000000000000000000000000000001", // approved: true
      from: walletAddress.toLowerCase(),
      to: contractAddress.toLowerCase(),
      owner: walletAddress.toLowerCase(),
      approved: "0x1234567890123456789012345678901234567890",
      operator: "0x1234567890123456789012345678901234567890"
    },
    {
      address: contractAddress.toLowerCase(),
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer
        "0x000000000000000000000000" + walletAddress.slice(2), // from
        "0x000000000000000000000000" + "0x0000000000000000000000000000000000000000".slice(2) // to (mint)
      ],
      data: "0x0000000000000000000000000000000000000000000000000000000000000001", // tokenId: 1
      from: walletAddress.toLowerCase(),
      to: "0x0000000000000000000000000000000000000000",
      owner: walletAddress.toLowerCase()
    }
  ];

  // Generate more events to simulate realistic interaction count
  const additionalEvents = [];
  for (let i = 0; i < 13; i++) { // Total 15 interactions
    additionalEvents.push({
      address: contractAddress.toLowerCase(),
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // Transfer
        "0x000000000000000000000000" + walletAddress.slice(2), // from
        "0x000000000000000000000000" + "0x1234567890123456789012345678901234567890".slice(2) // to
      ],
      data: `0x000000000000000000000000000000000000000000000000000000000000000${i + 2}`, // tokenId
      from: walletAddress.toLowerCase(),
      to: "0x1234567890123456789012345678901234567890",
      owner: walletAddress.toLowerCase()
    });
  }

  const allEvents = [...mockEvents, ...additionalEvents];

  return {
    events: allEvents,
    contractAddress: contractAddress.toLowerCase(),
    walletAddress: walletAddress.toLowerCase(),
    totalEvents: allEvents.length,
    message: `Found ${allEvents.length} interactions for wallet ${walletAddress} with contract ${contractAddress}`,
    dataSource: 'Substreams Simulation'
  };
}
