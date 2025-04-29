# Bitquery Streaming API Examples

This repository contains examples of using the Bitquery Streaming API with different blockchains.

## Solana Example (`solana.js`)

This script connects to the Bitquery Streaming API via WebSocket to subscribe to real-time Solana DEX pool and order data.

### Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Create Environment File:**
    Create a file named `.env` in the root directory.
3.  **Add API Token:**
    Add your Bitquery access token to the `.env` file:
    ```
    BITQUERY_ACCESS_TOKEN=YOUR_API_ACCESS_TOKEN
    ```
    Replace `YOUR_API_ACCESS_TOKEN` with your actual token.

### Usage

Run the script using Node.js:

```bash
node solana.js
```

### Output in the console

```json
  {
        ChainId: 'mainnet-beta.solana.com',
        Pool: {
          Base: { ChangeAmount: '-0.522103' },
          Dex: {
            ProgramAddress: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
            ProtocolName: 'lb_clmm'
          }
        },
        PoolEvent: { Index: 0 }
      },
      {
        ChainId: 'mainnet-beta.solana.com',
        Pool: {
          Base: { ChangeAmount: '340742.604011' },
          Dex: {
            ProgramAddress: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
            ProtocolName: 'pump'
          }
        },
        PoolEvent: { Index: 0 }
      },
      {
        ChainId: 'mainnet-beta.solana.com',
        Pool: {
          Base: { ChangeAmount: '-1.468190329' },
          Dex: {
            ProgramAddress: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
            ProtocolName: 'raydium_amm'
          }
        },
        PoolEvent: { Index: 0 }
      },
      {
        ChainId: 'mainnet-beta.solana.com',
        Pool: {
          Base: { ChangeAmount: '-200173.533649' },
          Dex: {
            ProgramAddress: 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA',
            ProtocolName: 'pump_amm'
          }
        },
        PoolEvent: { Index: 1 }
      },
      {
        ChainId: 'mainnet-beta.solana.com',
        Pool: {
          Base: { ChangeAmount: '1765.019336' },
          Dex: {
            ProgramAddress: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
            ProtocolName: 'lb_clmm'

      ```


The script will connect to Bitquery, print the received Solana DEX data to the console for 10 seconds, and then automatically disconnect.