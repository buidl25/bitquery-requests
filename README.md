### Query Files Overview

![Image](https://github.com/user-attachments/assets/4c1f1ee4-5fc3-4bf7-8f72-d418d5235038)

#### Overview of the repository and its contents

This repository contains GraphQL queries for different blockchain networks:

1. **solana/**: Queries for Solana blockchain
   - Trending SPL tokens
   - Price change analysis
   - Trading volume metrics

2. **BASE/queries.md**: Queries for Base (Ethereum L2)
   - Trending tokens on Base
   - 24h price charts
   - Token pair volume analysis

3. **BSC/queries.md**: Queries for Binance Smart Chain
   - Top traded tokens
   - Price change metrics
   - DEX trade analytics

4. **ETH/queries.md**: Queries for Ethereum mainnet
   - Popular ERC20 tokens
   - WETH trading pairs
   - Historical trade data

### Usage

Run the script using Node.js:

```bash
node solana.js
```

Available scripts:

- `npm start` or `node index.js`: Run the main application
- `npm run solana` or `node solana.js`: Run Solana blockchain queries
- `npm run solana-metrics` or `node solana-metrics.js`: Fetch Solana token metrics and trading data
- `npm run token-table` or `node solana/token-table-query.js`: Display Solana token data in table format
- `npm run token-supply` or `node solana/token-supply.js`: Query token supply information for Solana tokens
- `npm run evm` or `node evm.js`: Run EVM-compatible chain queries (ETH, BSC, Base)

![Image](https://github.com/user-attachments/assets/a98f3871-7169-4ae7-ae4b-2c8d053eafde)
*Running Solana token metrics script - fetches trending tokens and their trading data*

![Image](https://github.com/user-attachments/assets/8355545e-6e62-4f53-8a1f-9fb5b13d5da5)
*Token supply query results - shows circulating and total supply for Solana tokens*