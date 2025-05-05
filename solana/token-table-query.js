/**
 * Combined GraphQL query for token table data
 * Retrieves trending tokens and their associated metrics
 */
require('dotenv').config();
const https = require('https');

// Access token from .env file
const BITQUERY_ACCESS_TOKEN = process.env.BITQUERY_ACCESS_TOKEN;

// Check if API key is available
if (!BITQUERY_ACCESS_TOKEN) {
  console.warn('Warning: BITQUERY_ACCESS_TOKEN is not set in .env file');
  console.warn('You will need a valid API key to query the BitQuery API');
}

const getTrendingTokensTableData = `
query TrendingTokensTableData($limit: Int = 30, $time24hAgo: DateTime!) {
  Solana {
    # Get trending tokens
    DEXTrades(
      limit: {count: $limit}, 
      orderBy: {descendingByField: "count"}
    ) {
      count
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
        PriceInUSD
        Side {
          Currency {
            Symbol
          }
          AmountInUSD
        }
      }
      Block {
        Time
      }
      Transaction {
        Signer
      }
    }
    
    # Get 24h price data for chart (separate query for each token)
    PriceChart: DEXTrades(
      where: {Trade: {Currency: {MintAddress: {in: ["So11111111111111111111111111111111111111112", "8nHHGqeHMPTrbYs4KwWmLmVV5yqrnG2iL65QtMMvpump", "7BjdNnf99qT2hVi1BVcNzsGGHdcPAiyngqCLW4fpump"]}}}}
      orderBy: {ascendingByField: "Block_Time"}
      limit: {count: 100}
    ) {
      Block {
        Time
      }
      Trade {
        Currency {
          Symbol
          MintAddress
        }
        PriceInUSD
        Side {
          AmountInUSD
        }
      }
    }
    
    # Volume data
    VolumeData: DEXTrades(
      where: {Block: {Time: {since: $time24hAgo}}}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          MintAddress
        }
        Side {
          AmountInUSD
        }
      }
      count
    }
    
    # Buy/Sell ratio for sentiment calculation
    SentimentData: DEXTrades(
      where: {Block: {Time: {since: $time24hAgo}}}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          MintAddress
        }
        Side {
          Type
        }
      }
      count
    }
  }
}
`;

/**
 * Function to execute the query using HTTP request
 * @param {number} limit - Number of trending tokens to retrieve
 * @returns {Promise<Object>} Query results
 */
const fetchTrendingTokensTableData = async (limit = 30) => {
  return new Promise((resolve, reject) => {
    const time24hAgo = new Date();
    time24hAgo.setDate(time24hAgo.getDate() - 1);
    
    const variables = {
      limit,
      time24hAgo: time24hAgo.toISOString()
    };
    
    // Prepare the request data
    const requestData = JSON.stringify({
      query: getTrendingTokensTableData,
      variables
    });
    
    // Set up HTTP request options
    const options = {
      hostname: 'graphql.bitquery.io',
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'X-API-KEY': BITQUERY_ACCESS_TOKEN
      }
    };
    
    console.log('Sending HTTP request to BitQuery API...');
    
    // Make the HTTP request
    const req = https.request(options, (res) => {
      let data = '';
      
      // Collect data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Process the complete response
      res.on('end', () => {
        try {
          // Check if the response is valid JSON
          if (res.statusCode !== 200) {
            console.error(`HTTP Error: ${res.statusCode} ${res.statusMessage}`);
            reject(new Error(`HTTP Error: ${res.statusCode} ${res.statusMessage}`));
            return;
          }
          
          const response = JSON.parse(data);
          
          // Check for GraphQL errors
          if (response.errors) {
            console.error('GraphQL errors:', response.errors);
            reject(new Error(response.errors[0].message));
          } else {
            console.log('Data received from BitQuery API');
            resolve(response.data);
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          console.error('Response data:', data);
          reject(error);
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    
    // Send the request
    req.write(requestData);
    req.end();
  });
};

/**
 * Process the raw query results into a format suitable for the table
 * @param {Object} queryResults - Raw query results
 * @returns {Array} Formatted token data for the table
 */
const processTokenTableData = (queryResults) => {
  if (!queryResults || !queryResults.Solana) {
    console.error('Invalid query results structure');
    return [];
  }
  
  const { DEXTrades, PriceChart, VolumeData, SentimentData } = queryResults.Solana;
  
  // Group trades by token
  const tokenMap = new Map();
  
  // Process main token data
  if (DEXTrades && Array.isArray(DEXTrades)) {
    DEXTrades.forEach(trade => {
      if (!trade.Trade || !trade.Trade.Currency || !trade.Trade.Currency.MintAddress) return;
      
      const mintAddress = trade.Trade.Currency.MintAddress;
      
      if (!tokenMap.has(mintAddress)) {
        tokenMap.set(mintAddress, {
          token: {
            name: trade.Trade.Currency.Name || 'Unknown',
            symbol: trade.Trade.Currency.Symbol || 'UNKNOWN',
            mintAddress
          },
          price: trade.Trade.PriceInUSD || 0,
          priceChangePercentage: 0,
          chartData: [],
          volume: 0,
          marketCap: 0,
          sentiment: 'Neutral',
          popularity: trade.count || 0
        });
      }
    });
  }
  
  // Process price chart data
  if (PriceChart && Array.isArray(PriceChart)) {
    // Group chart data by token
    const chartDataByToken = {};
    
    PriceChart.forEach(point => {
      if (!point.Trade || !point.Trade.Currency || !point.Trade.Currency.MintAddress) return;
      
      const mintAddress = point.Trade.Currency.MintAddress;
      if (!chartDataByToken[mintAddress]) {
        chartDataByToken[mintAddress] = [];
      }
      
      chartDataByToken[mintAddress].push({
        time: point.Block.Time,
        price: point.Trade.PriceInUSD || 0,
        volume: point.Trade.Side.AmountInUSD || 0
      });
    });
    
    // Add chart data to tokens and calculate price change
    for (const [mintAddress, chartData] of Object.entries(chartDataByToken)) {
      if (tokenMap.has(mintAddress)) {
        const token = tokenMap.get(mintAddress);
        token.chartData = chartData;
        
        // Calculate price change if we have enough data points
        if (chartData.length >= 2) {
          const oldestPrice = chartData[0].price;
          const newestPrice = chartData[chartData.length - 1].price;
          
          if (oldestPrice > 0) {
            token.priceChangePercentage = ((newestPrice - oldestPrice) / oldestPrice) * 100;
          }
        }
      }
    }
  }
  
  // Process volume data
  if (VolumeData && Array.isArray(VolumeData)) {
    VolumeData.forEach(item => {
      if (!item.Trade || !item.Trade.Currency || !item.Trade.Currency.MintAddress) return;
      
      const mintAddress = item.Trade.Currency.MintAddress;
      if (tokenMap.has(mintAddress)) {
        const token = tokenMap.get(mintAddress);
        token.volume += (item.Trade.Side.AmountInUSD || 0);
      }
    });
  }
  
  // Process sentiment data
  if (SentimentData && Array.isArray(SentimentData)) {
    const sentimentByToken = {};
    
    SentimentData.forEach(item => {
      if (!item.Trade || !item.Trade.Currency || !item.Trade.Currency.MintAddress) return;
      
      const mintAddress = item.Trade.Currency.MintAddress;
      if (!sentimentByToken[mintAddress]) {
        sentimentByToken[mintAddress] = { buys: 0, sells: 0 };
      }
      
      if (item.Trade.Side.Type === 'buy') {
        sentimentByToken[mintAddress].buys += item.count || 0;
      } else if (item.Trade.Side.Type === 'sell') {
        sentimentByToken[mintAddress].sells += item.count || 0;
      }
    });
    
    // Calculate sentiment based on buy/sell ratio
    for (const [mintAddress, data] of Object.entries(sentimentByToken)) {
      if (tokenMap.has(mintAddress)) {
        const token = tokenMap.get(mintAddress);
        const { buys, sells } = data;
        const total = buys + sells;
        
        if (total > 0) {
          const buyRatio = buys / total;
          token.sentiment = buyRatio > 0.6 ? 'Greed' : buyRatio < 0.4 ? 'Fear' : 'Neutral';
        }
      }
    }
  }
  
  // Convert map to array and sort by popularity
  return Array.from(tokenMap.values())
    .sort((a, b) => b.popularity - a.popularity);
};



/**
 * Sample data for demonstration purposes when API access fails
 */
const getSampleData = () => {
  return {
    Solana: {
      DEXTrades: [
        {
          count: 1245,
          Trade: {
            Currency: {
              Name: "PENGU",
              Symbol: "PENGU",
              MintAddress: "8nHHGqeHMPTrbYs4KwWmLmVV5yqrnG2iL65QtMMvpump"
            },
            PriceInUSD: 0.001234,
            Side: {
              Currency: { Symbol: "SOL" },
              AmountInUSD: 5000
            }
          },
          Block: { Time: "2025-05-04T12:00:00Z" },
          Transaction: { Signer: "abc123" }
        },
        {
          count: 987,
          Trade: {
            Currency: {
              Name: "BAN",
              Symbol: "BAN",
              MintAddress: "7BjdNnf99qT2hVi1BVcNzsGGHdcPAiyngqCLW4fpump"
            },
            PriceInUSD: 0.001234,
            Side: {
              Currency: { Symbol: "SOL" },
              AmountInUSD: 4500
            }
          },
          Block: { Time: "2025-05-04T12:00:00Z" },
          Transaction: { Signer: "def456" }
        },
        {
          count: 756,
          Trade: {
            Currency: {
              Name: "BBT",
              Symbol: "BBT",
              MintAddress: "2Fi6ARL9LjGew71NQk3J5k6TAKyCyun9bJ3ZNeC9pump"
            },
            PriceInUSD: 0.001234,
            Side: {
              Currency: { Symbol: "SOL" },
              AmountInUSD: 3800
            }
          },
          Block: { Time: "2025-05-04T12:00:00Z" },
          Transaction: { Signer: "ghi789" }
        },
        {
          count: 543,
          Trade: {
            Currency: {
              Name: "NERO",
              Symbol: "NERO",
              MintAddress: "C8bMgbdS12VyGSLp1MDSXFm2zv2RBkCAt22RNvSGpump"
            },
            PriceInUSD: 0.001234,
            Side: {
              Currency: { Symbol: "SOL" },
              AmountInUSD: 2900
            }
          },
          Block: { Time: "2025-05-04T12:00:00Z" },
          Transaction: { Signer: "jkl012" }
        }
      ],
      PriceChart: [],
      VolumeData: [],
      SentimentData: []
    }
  };
};

/**
 * Main function to execute the query and save results
 */
const main = async () => {
  try {
    console.log('Fetching trending tokens data...');
    
    let data;
    try {
      // Try to fetch data from API
      data = await fetchTrendingTokensTableData();
    } catch (apiError) {
      console.warn(`API Error: ${apiError.message}`);
      console.warn('Using sample data for demonstration purposes');
      console.warn('To use real data, please set a valid BITQUERY_ACCESS_TOKEN in your .env file');
      
      // Use sample data when API access fails
      data = getSampleData();
    }
    
    const processedData = processTokenTableData(data);
    
    console.log(`Retrieved data for ${processedData.length} tokens`);
    console.log(JSON.stringify(processedData, null, 2));
  } catch (error) {
    console.error('Error processing token data:', error);
  }
};

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  getTrendingTokensTableData,
  fetchTrendingTokensTableData,
  processTokenTableData,
  main
};
