### List of trending tokens

```json
subscription {
  EVM(network: base) {
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
            "SmartContract": "0x4200000000000000000000000000000000000006",
            "Symbol": "WETH"
          }
        },
        "tradesCountWithUniqueTraders": "217455"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "USD Coin",
            "SmartContract": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
            "Symbol": "USDC"
          }
        },
        "tradesCountWithUniqueTraders": "216470"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Aerodrome",
            "SmartContract": "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
            "Symbol": "AERO"
          }
        },
        "tradesCountWithUniqueTraders": "193222"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Zora",
            "SmartContract": "0x1111111111166b7fe7bd91427724b487980afc69",
            "Symbol": "ZORA"
          }
        },
        "tradesCountWithUniqueTraders": "189580"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Virtual Protocol",
            "SmartContract": "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
            "Symbol": "VIRTUAL"
          }
        },
        "tradesCountWithUniqueTraders": "189008"
      },
    ]
  }
}

### For token chart 24h

### Parameters
```json
{
  "token": "0x4200000000000000000000000000000000000006"
}
```

```graphql
query ($token: String) {
  EVM(aggregates: no, network: base) {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Amount: {gt: "0"}, Side: {AmountInUSD: {gt: "0"}}, Currency: {SmartContract: {is: $token}}} }
    ) {
      Block {
        Time(interval: {count: 24, in: hours})
      }
      Trade {
        open: PriceInUSD(minimum: Block_Time)
        close: PriceInUSD(maximum: Block_Time)
        max: PriceInUSD(maximum: Trade_PriceInUSD)
        min: PriceInUSD(minimum: Trade_PriceInUSD)
      }
      volume: sum(of: Trade_Side_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
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
        "Block": {
          "Time": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 1842.3630034748228,
          "max": 21093.568378744483,
          "min": 1059.03716356177,
          "open": 1801.4154936674836
        },
        "volume": "8780094707.561968768",
        "volumeUsd": "683895.3482899817"
      },
      {
        "Block": {
          "Time": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 1837.47683383385,
          "max": 22167623.986570023,
          "min": 0.1686091829368161,
          "open": 1803.5955151243593
        },
        "volume": "11111412797775.945156850463847073",
        "volumeUsd": "158412804.4557647"
      },
      {
        "Block": {
          "Time": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 1.831215755790731e+21,
          "max": 2.1585679448159316e+21,
          "min": 1.79899407537535e+21,
          "open": 1.79899407537535e+21
        },
        "volume": "23892591759237481197304138",
        "volumeUsd": "269283420633959760000"
      },
      {
        "Block": {
          "Time": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 1837.3795615171111,
          "max": 3699.48187086621,
          "min": 972.4522569444446,
          "open": 1796.927873945795
        },
        "volume": "105928266.18819393",
        "volumeUsd": "77101535.58607075"
      },
    ]
  }
}

### Last price and token info 

```graphql
subscription {
  EVM(network: base) {
    DEXTrades {
      Block {
        Time
      } 
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Price
          PriceInUSD
          Amount 
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
            Fungible
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount 
          Currency {
            Name
            Symbol
            SmartContract
            Decimals
            Fungible
          }
        }
      }
    }
  }
}
```

### Response 
```json
{
  "EVM": {
    "DEXTrades": [
      {
        "Block": {
          "Time": "2025-05-05T13:55:11Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "11.122444",
            "Currency": {
              "Decimals": 6,
              "Fungible": true,
              "Name": "USD Base Coin",
              "SmartContract": "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca",
              "Symbol": "USDbC"
            },
            "Price": 0.0005554657498847027,
            "PriceInUSD": 0.9991808361966846
          },
          "Dex": {
            "ProtocolFamily": "Uniswap",
            "ProtocolName": "uniswap_v3"
          },
          "Sell": {
            "Amount": "0.006178136697010613",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "Name": "Wrapped Ether",
              "SmartContract": "0x4200000000000000000000000000000000000006",
              "Symbol": "WETH"
            },
            "Price": 1800.2910174165888,
            "PriceInUSD": 1798.804726074674
          }
        }
      },
      {
        "Block": {
          "Time": "2025-05-05T13:55:11Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "644.298417",
            "Currency": {
              "Decimals": 6,
              "Fungible": true,
              "Name": "USD Coin",
              "SmartContract": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
              "Symbol": "USDC"
            },
            "Price": 0.0005554711283749276,
            "PriceInUSD": 0.9991905111124855
          },
          "Dex": {
            "ProtocolFamily": "Uniswap",
            "ProtocolName": "uniswap_v3"
          },
          "Sell": {
            "Amount": "0.357889168701169659",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "Name": "Wrapped Ether",
              "SmartContract": "0x4200000000000000000000000000000000000006",
              "Symbol": "WETH"
            },
            "Price": 1800.2735856417503,
            "PriceInUSD": 1800.191926789729
          }
        }
      },
      {
        "Block": {
          "Time": "2025-05-05T13:55:11Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "125.251321",
            "Currency": {
              "Decimals": 6,
              "Fungible": true,
              "Name": "USD Coin",
              "SmartContract": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
              "Symbol": "USDC"
            },
            "Price": 0.000555441573293174,
            "PriceInUSD": 0.9991373469501469
          },
          "Dex": {
            "ProtocolFamily": "PancakeSwap",
            "ProtocolName": "pancake_swap_v3"
          },
          "Sell": {
            "Amount": "0.069569790793288358",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "Name": "Wrapped Ether",
              "SmartContract": "0x4200000000000000000000000000000000000006",
              "Symbol": "WETH"
            },
            "Price": 1800.369378314753,
            "PriceInUSD": 1800.287715117659
          }
        }
      },
    ]
  }
}

### Token info

```graphql
query TokenInfo {
  EVM(network: base) {
    DEXTrades {
      Block {
        Time
      } 
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
        }
        Buy {
          Price
          PriceInUSD
          Amount 
          Currency {
            Name
            Symbol 
            SmartContract
            Decimals
            Fungible
            HasURI
          }
        }
        Sell {
          Price
          PriceInUSD
          Amount 
          Currency {
            Name
            Symbol 
            SmartContract 
            Decimals
            Fungible 
          }
        }
      }
      Transaction { 
        Hash
      }
    }
  }
} 
```

### Response 
```json
{
  "EVM": {
    "DEXTrades": [
      {
        "Block": {
          "Time": "2025-05-04T05:04:31Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "0.546427092425013000",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "HasURI": false,
              "Name": "Wrapped Ether",
              "SmartContract": "0x4200000000000000000000000000000000000006",
              "Symbol": "WETH"
            },
            "Price": 1836.4637275698603,
            "PriceInUSD": 1836.4095439946386
          },
          "Dex": {
            "ProtocolFamily": "PancakeSwap",
            "ProtocolName": "pancake_swap_v3"
          },
          "Sell": {
            "Amount": "1003.493535",
            "Currency": {
              "Decimals": 6,
              "Fungible": true,
              "Name": "USD Coin",
              "SmartContract": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
              "Symbol": "USDC"
            },
            "Price": 0.0005445247760614751,
            "PriceInUSD": 0.997457187862055
          }
        },
        "Transaction": {
          "Hash": "0x1529c16a14d59e521a257a9373b79de2be6e34ff48c4fbc1e8fad3443a09c22e"
        }
      },
    ]
  }
}

### 24H volume for pair

```graphql
query ($token: String) {
  EVM(network: base) {
    DEXTradeByTokens(where: {Trade: {Currency: {SmartContract: {is: $token}}}}) {
      volume: sum(of: Trade_AmountInUSD)
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
        "volume": "1011793331.9601972"
      }
    ]
  }
}

### 24H metrics for token

### Parameters
```json
{
  "address": "Dezkhsv7U4Z1KMp65HhzAGp9UkNTaB9yPvr7ttLCpump",
  "pair_address": "B4kXZHHmC6aDjFRd7Fgde3HU85q2vMzbN7MxwheGnPHo",
  "time_24h_ago": "2025-01-01T04:30:15Z"
}
```

```graphql
query ($address: String!, $pair_address: String!, $time_24h_ago: DateTime!) {
  EVM(network: base) {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Currency: {SmartContract: {is: $address}}, Side: {Currency: {SmartContract: {is: "So11111111111111111111111111111111111111112"}}}, Market: {MarketAddress: {is: $pair_address}}}, Block: {Time: {since: $time_24h_ago}}}
    ) {
      Trade {
        
      }
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
          
        }
      }
    ]
  }
}

### Price change 24h  BSC BNB/USDT

### Params example
```json
{
  "network": "base",
  "from": "2025-04-04T00:00:00",
  "limit": 100
}
```

```graphql
query getLegacyTokenCandles($limit: Int, $from: ISO8601DateTime) {
  ethereum(network: base) {
    dexTrades(
      quoteCurrency: {is: "0x55d398326f99059ff775485246999027b3197955"}
      time: {since: $from}
      options: {limit: $limit, desc: "final", limitBy: {each: "baseCurrency.address, quoteCurrency.address", limit: 1}}
      priceAsymmetry: {lt: 0.001}
      sellCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
    ) {
      timeInterval {
        hour(count: 24)
      }
      baseCurrency {
        name
        address
      }
      quoteCurrency {
        name
        address
      }
      open_price: minimum(of: block, get: quote_price)
      close_price: maximum(of: block, get: quote_price)
      open_price_time: minimum(of: block, get: time)
      close_price_time: maximum(of: block, get: time)
      diff: expression(get: "close_price - open_price")
      div: expression(get: "diff / open_price")
      final: expression(get: "div * 100")
    }
  }
}
```

### Response example
```json
{
  "ethereum": {
    "dexTrades": [
      {
        "timeInterval": {
          "hour": "2025-02-12 00:00:00"
        },
        "baseCurrency": {
          "name": "Wrapped BNB",
          "address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
        },
        "quoteCurrency": {
          "name": "Tether USD",
          "address": "0x55d398326f99059ff775485246999027b3197955"
        },
        "open_price": "642.7123640229943",
        "close_price": "698.8528738666441",
        "open_price_time": "2025-02-12 00:00:05 UTC",
        "close_price_time": "2025-02-12 23:59:53 UTC",
        "diff": "56.14050984364985",
        "div": "0.08734935405979107",
        "final": "8.734935405979106"
      }
    ]
  }
}
