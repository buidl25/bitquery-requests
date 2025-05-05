 
const axios = require('axios');
require('dotenv').config(); 

// Access token from .env file
const BITQUERY_ACCESS_TOKEN = process.env.BITQUERY_ACCESS_TOKEN;
const endpoint = 'https://graphql.bitquery.io';

// Check if token is available
if (!BITQUERY_ACCESS_TOKEN) {
  console.error("Error: BITQUERY_ACCESS_TOKEN is not set in .env file");
  console.error("Please obtain a valid API key from https://bitquery.io/ and add it to your .env file");
  process.exit(1);
}

const trendingTokensQuery = `
  query TrendingTokensWithBasicMetrics($limit: Int = 30, $time24hAgo: DateTime!) {
    solana {
      dexTrades(
        limit: $limit
        orderBy: {descending: "tradeAmount"}
        time: {since: $time24hAgo}
      ) {
        tradeAmount
        baseCurrency {
          symbol
          address
        }
        tradeAmountUsd
        trades
        sellAmount
        sellAmountUsd
        buyAmount
        buyAmountUsd
      }
    }
  }
`;

const chartDataQuery = `
  query TokenChartData24h($address: String!, $time24hAgo: DateTime!) {
    solana {
      dexTrades(
        options: {asc: "timeInterval.hour"}
        time: {since: $time24hAgo}
        baseCurrency: {is: $address}
        quoteCurrency: {is: "So11111111111111111111111111111111111111112"}
      ) {
        timeInterval {
          hour
        }
        high
        low
        open
        close
        tradeAmount
        tradeAmountUsd
      }
    }
  }
`;

async function fetchTrendingTokens() {
  const variables = {
    limit: 20,
    time24hAgo: '2025-05-04T00:00:00Z'
  };
  const response = await axios.post(
    endpoint,
    { query: trendingTokensQuery, variables },
    { 
      headers: { 
        'X-API-KEY': BITQUERY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      } 
    }
  );
  return response.data.data.solana.dexTrades;
}

async function fetchChartData(mintAddress) {
  const variables = {
    address: mintAddress,
    time24hAgo: '2025-05-04T00:00:00Z'
  };
  const response = await axios.post(
    endpoint,
    { query: chartDataQuery, variables },
    { 
      headers: { 
        'X-API-KEY': BITQUERY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      } 
    }
  );
  return response.data.data.solana.dexTrades;
}



async function main() {
  try {
    console.log('Fetching trending tokens data...');
    const trendingTokens = await fetchTrendingTokens();
    const results = [];
    
    // Process trending tokens
    for (const token of trendingTokens) {
      const address = token.baseCurrency.address;
      console.log(`Fetching chart data for ${address}...`);
      const chartData = await fetchChartData(address);
      results.push({
        ...token,
        chartData24h: chartData
      });
    }

    // Add specific token (3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh)
    const specificAddress = '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh';
    if (!trendingTokens.some(token => token.baseCurrency.address === specificAddress)) {
      console.log(`Fetching chart data for specific token ${specificAddress}...`);
      const chartData = await fetchChartData(specificAddress);
      results.push({
        baseCurrency: {
          address: specificAddress,
          name: "Unknown", // Placeholder; fetch actual Name/Symbol if needed
          symbol: "Unknown"
        },
        quoteCurrency: {
          address: "So11111111111111111111111111111111111111112"
        },
        tradeAmount: 0,
        trades: 0,
        volumeUSD: 0,
        buyCount: 0,
        sellCount: 0,
        buyVolumeUSD: 0,
        sellVolumeUSD: 0,
        uniqueAddresses: 0,
        chartData24h: chartData
      });
    }

    console.log(JSON.stringify({ Solana: { trendingTokens: results } }, null, 2));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Error: Unauthorized - Invalid API key');
      console.error('Please check your BITQUERY_ACCESS_TOKEN in the .env file');
      console.error('You can obtain a valid API key from https://bitquery.io/');
    } else {
      console.error('Error:', error.message || error);
    }
    process.exit(1);
  }
}

main(); 