### List of trending tokens

```json

subscription {
  EVM(network: eth) {
    DEXTradeByTokens(
      limit: {count: 30}
      orderBy: {descendingByField: "tradesCountWithUniqueTraders"}
    ) {
      Trade {
        Currency {
          Name
          Symbol
          SmartContract
        }
      }
      tradesCountWithUniqueTraders: count(distinct: Transaction_Time)
    }
  }
}

```

### Response 
```json
{
  "EVM": {
    "DEXTradeByTokens": [
      {
        "Trade": {
          "Currency": {
            "Name": "Wrapped Ether",
            "SmartContract": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            "Symbol": "WETH"
          }
        },
        "tradesCountWithUniqueTraders": "8857"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "USD Coin",
            "SmartContract": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "Symbol": "USDC"
          }
        },
        "tradesCountWithUniqueTraders": "8104"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Tether USD",
            "SmartContract": "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "Symbol": "USDT"
          }
        },
        "tradesCountWithUniqueTraders": "8029"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Wrapped BTC",
            "SmartContract": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
            "Symbol": "WBTC"
          }
        },
        "tradesCountWithUniqueTraders": "3731"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Ethereum",
            "SmartContract": "0x",
            "Symbol": "ETH"
          }
        },
        "tradesCountWithUniqueTraders": "3515"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "GORKLON",
            "SmartContract": "0x38731c2467e4e19ee031d7401466a970f21755e0",
            "Symbol": "GORKLON"
          }
        },
        "tradesCountWithUniqueTraders": "2346"
      },
      ```
