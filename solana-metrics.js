const { WebSocket } = require("ws");
const dotenv = require("dotenv");
dotenv.config();

const token = process.env.BITQUERY_ACCESS_TOKEN;
if (!token) {
  console.error("Error: BITQUERY_ACCESS_TOKEN is not set in .env file");
  process.exit(1);
}

// Connect to Bitquery WebSocket
const bitqueryConnection = new WebSocket(
  "wss://streaming.bitquery.io/graphql?token=" + token,
  ["graphql-ws"]
);

// Handle connection events
bitqueryConnection.on("open", () => {
  console.log("Connection established with Bitquery");
  
  // Send the connection initialization message
  const connectionInit = JSON.stringify({
    type: "connection_init",
    payload: {}
  });
  
  bitqueryConnection.send(connectionInit);
  console.log("Connection initialization message sent");
});

bitqueryConnection.on("error", (error) => {
  console.error("WebSocket error:", error);
});

bitqueryConnection.on("close", (code, reason) => {
  console.log(`Connection closed: ${code} - ${reason}`);
});

bitqueryConnection.on("message", (data) => {
  try {
    const response = JSON.parse(data);
    console.log(`Received message type: ${response.type}`);

    if (response.type === "connection_ack") {
      console.log("Connection acknowledged by server.");
      sendMetricsQuery();
    } else if (response.type === "data") {
      handleDataResponse(response);
    } else if (response.type === "error") {
      console.error("Query error:", response.payload);
    } else if (response.type === "ka") {
      // Keep-alive message, can be ignored
    }
  } catch (error) {
    console.error("Error processing message:", error);
    console.log("Raw message:", data.toString());
  }
});

function sendMetricsQuery() {
  // Parameters for the query (adjust dates as needed)
  const variables = {
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC on Solana
    startTime: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    endTime: new Date().toISOString()
  };

  console.log(`Querying metrics for token: ${variables.mintAddress}`);
  console.log(`Time period: ${variables.startTime} to ${variables.endTime}`);

  // Check blockchain schema first
  const schemaQuery = JSON.stringify({
    type: "start",
    id: "schema_query",
    payload: {
      query: `
      {
        __schema {
          types {
            name
            kind
          }
        }
      }
      `
    }
  });

  // Send schema query
  bitqueryConnection.send(schemaQuery);
  console.log("Schema query sent");

  // Format a simple token info query for Solana
  setTimeout(() => {
    if (bitqueryConnection.readyState === WebSocket.OPEN) {
      const simpleQuery = JSON.stringify({
        type: "start",
        id: "simple_query",
        payload: {
          query: `
          query ($limit: Int = 10) {
            solana {
              tokens(limit: {count: $limit}) {
                token {
                  name
                  symbol
                  mintAddress
                  decimals
                }
              }
            }
          }
          `
        }
      });
      
      bitqueryConnection.send(simpleQuery);
      console.log("Simple token query sent");
    }
  }, 1000);

  // Try to get specific token info
  setTimeout(() => {
    if (bitqueryConnection.readyState === WebSocket.OPEN) {
      const tokenQuery = JSON.stringify({
        type: "start",
        id: "token_query",
        payload: {
          query: `
          query ($mintAddress: String!) {
            solana {
              tokens(
                where: {token: {mintAddress: {is: $mintAddress}}}
              ) {
                token {
                  name
                  symbol
                  mintAddress
                  decimals
                }
              }
            }
          }
          `,
          variables: variables
        }
      });
      
      bitqueryConnection.send(tokenQuery);
      console.log("Token query sent");
    }
  }, 2000);

  // Try to get trades
  setTimeout(() => {
    if (bitqueryConnection.readyState === WebSocket.OPEN) {
      const tradesQuery = JSON.stringify({
        type: "start",
        id: "trades_query",
        payload: {
          query: `
          query ($mintAddress: String!, $startTime: ISO8601DateTime, $endTime: ISO8601DateTime, $limit: Int = 10) {
            solana {
              dexTrades(
                options: {limit: $limit, desc: "block.timestamp"}
                where: {baseCurrency: {mintAddress: {is: $mintAddress}}}
                date: {since: $startTime, till: $endTime}
              ) {
                block {
                  timestamp
                }
                baseCurrency {
                  symbol
                }
                quoteCurrency {
                  symbol
                }
                quotePrice
                baseAmount
                quoteAmount
                side
                exchange {
                  name
                }
              }
            }
          }
          `,
          variables: variables
        }
      });
      
      bitqueryConnection.send(tradesQuery);
      console.log("Trades query sent");
    }
  }, 3000);
}

function handleDataResponse(response) {
  console.log(`Data received for query ID: ${response.id}`);
  
  if (!response.payload || !response.payload.data) {
    console.error("No data in response payload:", response);
    return;
  }

  const data = response.payload.data;
  
  if (response.id === "metrics_query") {
    if (!data.Solana || !data.Solana.TokenInfos) {
      console.warn("No token info data received");
      return;
    }

    console.log("Basic Token Info Received:");
    const tokenInfo = data.Solana.TokenInfos;
    
    if (tokenInfo.length > 0) {
      console.table({
        "Token Name": tokenInfo[0].Currency.Name || "N/A",
        "Symbol": tokenInfo[0].Currency.Symbol || "N/A",
        "Mint Address": tokenInfo[0].Currency.MintAddress,
        "Decimals": tokenInfo[0].Currency.Decimals || "N/A"
      });
    } else {
      console.warn("No token information found for the specified mint address");
    }
  } 
  else if (response.id === "detailed_metrics_query") {
    if (!data.Solana || !data.Solana.DEXTrades) {
      console.warn("No trade data received");
      return;
    }

    const trades = data.Solana.DEXTrades;
    console.log(`Received ${trades.length} recent trades`);
    
    if (trades.length > 0) {
      // Get the most recent price
      const currentPrice = trades[0].Price;
      
      // Calculate total volume from trades
      const volumeUSD = trades.reduce((sum, trade) => sum + (trade.Trade.AmountInUSD || 0), 0);
      
      // Calculate price change if we have enough data
      let priceChange = "N/A";
      if (trades.length > 1) {
        const oldestTrade = trades[trades.length - 1];
        const priceDiff = ((currentPrice - oldestTrade.Price) / oldestTrade.Price * 100).toFixed(2);
        priceChange = `${priceDiff}%`;
      }
      
      // Display summary statistics
      console.table({
        "Symbol": trades[0].Trade.Currency.Symbol,
        "Current Price": `${currentPrice}`,
        "Sample Volume": `${volumeUSD.toLocaleString()}`,
        "Price Change": priceChange,
        "Exchanges": [...new Set(trades.map(t => t.Exchange.FullName))].join(", ")
      });
      
      // Display recent trades
      console.log("\nMost Recent Trades:");
      console.table(
        trades.slice(0, 5).map(trade => ({
          "Time": new Date(trade.Block.Time).toLocaleString(),
          "Price": `${trade.Price}`,
          "Amount": trade.Trade.Amount,
          "Value (USD)": `${trade.Trade.AmountInUSD?.toLocaleString() || "N/A"}`,
          "Side": trade.Side,
          "Exchange": trade.Exchange.FullName
        }))
      );
    } else {
      console.warn("No trades found for the specified time period");
    }
  }
}

// Handle program termination
process.on('SIGINT', () => {
  console.log('Closing connection...');
  bitqueryConnection.close();
  process.exit(0);
});