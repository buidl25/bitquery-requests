/**
 * Token supply query executor
 * Fetches token supply information from BitQuery using WebSocket
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

// Access token from .env file
const BITQUERY_ACCESS_TOKEN = process.env.BITQUERY_ACCESS_TOKEN;

// Check if API key is available
if (!BITQUERY_ACCESS_TOKEN) {
  console.warn('Warning: BITQUERY_ACCESS_TOKEN is not set in .env file');
  console.warn('You will need a valid API key to query the BitQuery API');
}

/**
 * Read query from token-supply.json file
 * @returns {Object} Query and variables
 */
const readQueryFile = () => {
  const filePath = path.join(__dirname, 'token-supply.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
};

/**
 * Execute token supply query
 * @param {Array<string>} tokens - Optional array of token addresses to override the ones in JSON file
 * @returns {Promise<Object>} Query results
 */
const fetchTokenSupply = async (tokens = null) => {
  return new Promise((resolve, reject) => {
    const queryData = readQueryFile();
    
    // Override tokens if provided
    if (tokens && Array.isArray(tokens) && tokens.length > 0) {
      queryData.variables.tokens = tokens;
    }
    
    // Prepare the request data
    const requestData = JSON.stringify({
      query: queryData.query,
      variables: queryData.variables
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
 * Process token supply data
 * @param {Object} data - Raw query results
 * @returns {Array} Formatted token supply data
 */
const processTokenSupplyData = (data) => {
  if (!data || !data.Solana || !data.Solana.TokenSupply) {
    return [];
  }
  
  return data.Solana.TokenSupply.map(item => {
    const { Currency, Amount, TotalSupply, CirculatingSupply } = item;
    
    return {
      token: {
        name: Currency.Name,
        symbol: Currency.Symbol,
        mintAddress: Currency.MintAddress,
        decimals: Currency.Decimals
      },
      amount: Amount,
      totalSupply: TotalSupply,
      circulatingSupply: CirculatingSupply
    };
  });
};



/**
 * Sample data for demonstration purposes when API access fails
 */
const getSampleData = () => {
  return {
    Solana: {
      TokenSupply: [
        {
          Currency: {
            MintAddress: "So11111111111111111111111111111111111111112",
            Name: "Wrapped SOL",
            Symbol: "WSOL",
            Decimals: 9
          },
          Amount: "500000000",
          TotalSupply: "500000000",
          CirculatingSupply: "450000000"
        },
        {
          Currency: {
            MintAddress: "8nHHGqeHMPTrbYs4KwWmLmVV5yqrnG2iL65QtMMvpump",
            Name: "PENGU",
            Symbol: "PENGU",
            Decimals: 9
          },
          Amount: "1000000000",
          TotalSupply: "1000000000",
          CirculatingSupply: "750000000"
        },
        {
          Currency: {
            MintAddress: "7BjdNnf99qT2hVi1BVcNzsGGHdcPAiyngqCLW4fpump",
            Name: "BAN",
            Symbol: "BAN",
            Decimals: 9
          },
          Amount: "1000000000",
          TotalSupply: "1000000000",
          CirculatingSupply: "800000000"
        },
        {
          Currency: {
            MintAddress: "2Fi6ARL9LjGew71NQk3J5k6TAKyCyun9bJ3ZNeC9pump",
            Name: "BBT",
            Symbol: "BBT",
            Decimals: 9
          },
          Amount: "999999180",
          TotalSupply: "999999180",
          CirculatingSupply: "950000000"
        },
        {
          Currency: {
            MintAddress: "C8bMgbdS12VyGSLp1MDSXFm2zv2RBkCAt22RNvSGpump",
            Name: "NERO",
            Symbol: "NERO",
            Decimals: 9
          },
          Amount: "999999984",
          TotalSupply: "999999984",
          CirculatingSupply: "900000000"
        }
      ]
    }
  };
};

/**
 * Main function to execute the query and save results
 */
const main = async () => {
  try {
    // Get tokens from command line arguments if provided
    const tokens = process.argv.slice(2);
    
    console.log('Fetching token supply data...');
    console.log(tokens.length > 0 ? `Using provided tokens: ${tokens.join(', ')}` : 'Using tokens from token-supply.json');
    
    let data;
    try {
      // Try to fetch data from API
      data = await fetchTokenSupply(tokens.length > 0 ? tokens : null);
    } catch (apiError) {
      console.warn(`API Error: ${apiError.message}`);
      console.warn('Using sample data for demonstration purposes');
      console.warn('To use real data, please set a valid BITQUERY_ACCESS_TOKEN in your .env file');
      
      // Use sample data when API access fails
      data = getSampleData();
    }
    
    const processedData = processTokenSupplyData(data);
    
    console.log(`Retrieved supply data for ${processedData.length} tokens`);
    console.log(JSON.stringify(processedData, null, 2));
  } catch (error) {
    console.error('Error processing token supply data:', error);
  }
};

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  fetchTokenSupply,
  processTokenSupplyData,
  main
};
