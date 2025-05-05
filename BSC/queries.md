![Image](https://github.com/user-attachments/assets/4c1f1ee4-5fc3-4bf7-8f72-d418d5235038)


### List of trending tokens

```json
{
  EVM(network: bsc){
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
            "Name": "Wrapped BNB",
            "SmartContract": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
            "Symbol": "WBNB"
          }
        },
        "tradesCountWithUniqueTraders": "61151"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Tether USD",
            "SmartContract": "0x55d398326f99059ff775485246999027b3197955",
            "Symbol": "USDT"
          }
        },
        "tradesCountWithUniqueTraders": "60814"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "BSquared Token",
            "SmartContract": "0x783c3f003f172c6ac5ac700218a357d2d66ee2a2",
            "Symbol": "B2"
          }
        },
        "tradesCountWithUniqueTraders": "46259"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "USD Coin",
            "SmartContract": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
            "Symbol": "USDC"
          }
        },
        "tradesCountWithUniqueTraders": "43810"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Binance Smart Chain Native Token",
            "SmartContract": "0x",
            "Symbol": "BNB"
          }
        },
        "tradesCountWithUniqueTraders": "36410"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "OKZOO",
            "SmartContract": "0x55ad16bd573b3365f43a9daeb0cc66a73821b4a5",
            "Symbol": "AIOT"
          }
        },
        "tradesCountWithUniqueTraders": "28313"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "BUSD Token",
            "SmartContract": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
            "Symbol": "BUSD"
          }
        },
        "tradesCountWithUniqueTraders": "24640"
      },
      {
        "Trade": {
          "Currency": {
            "Name": "Ethereum Token",
            "SmartContract": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
            "Symbol": "ETH"
          }
        },

      }
    ]
  }
}


### Token info

```json
{
  EVM(network: bsc){
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
          "Time": "2025-05-05T03:54:44Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "0.005890000000000000",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "HasURI": false,
              "Name": "Wrapped BNB",
              "SmartContract": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
              "Symbol": "WBNB"
            },
            "Price": 7158.996163383719,
            "PriceInUSD": 587.7172897076534
          },
          "Dex": {
            "ProtocolFamily": "PancakeSwap",
            "ProtocolName": "pancake_swap_v3"
          },
          "Sell": {
            "Amount": "42.166487402330106998",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "Name": "SIREN",
              "SmartContract": "0x997a58129890bbda032231a52ed1ddc845fc18e1",
              "Symbol": "SIREN"
            },
            "Price": 0.00013968438831057388,
            "PriceInUSD": 0.08221729825256759
          }
        },
        "Transaction": {
          "Hash": "0x8661fb906ede348d60870c1b0d40323b116e74f3a0c616871ce025e128e5f3b0"
        }
      },
      {
        "Block": {
          "Time": "2025-05-05T03:54:44Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "338.606163296909918208",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "HasURI": false,
              "Name": "Tether USD",
              "SmartContract": "0x55d398326f99059ff775485246999027b3197955",
              "Symbol": "USDT"
            },
            "Price": 0.01976710949331111,
            "PriceInUSD": 0
          },
          "Dex": {
            "ProtocolFamily": "Uniswap",
            "ProtocolName": "uniswap_v2"
          },
          "Sell": {
            "Amount": "6.693265105",
            "Currency": {
              "Decimals": 9,
              "Fungible": true,
              "Name": "NovaBank",
              "SmartContract": "0x3595afff15a7ccaeeeb787fd676f7a297319c24c",
              "Symbol": "NVB"
            },
            "Price": 50.5890858923195,
            "PriceInUSD": 50.59120266415438
          }
        },
        "Transaction": {
          "Hash": "0xd09910561491f882037556f8776524995008030269708b80eece62f379768ef2"
        }
      },
      {
        "Block": {
          "Time": "2025-05-05T03:54:44Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "0.391269549169510000",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "HasURI": false,
              "Name": "Wrapped BNB",
              "SmartContract": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
              "Symbol": "WBNB"
            },
            "Price": 2119.4983761696376,
            "PriceInUSD": 0
          },
          "Dex": {
            "ProtocolFamily": "PancakeSwap",
            "ProtocolName": "pancake_swap_v3"
          },

### For token chart 24h

### Parameters
```json
{
  "token": "0x4200000000000000000000000000000000000006"
}
```

```graphql

query Charts($token: String) {  
    EVM(network: bsc) 
  {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Amount: {gt: "0"}, Side: {AmountInUSD: {gt: "0"}}, Currency: {SmartContract: {is: $token}}}}
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
          "Time": "2025-05-04T00:00:00Z"
        },
        "Trade": {
          "close": 1.0036133398726563,
          "max": 135031.33975687463,
          "min": 1.0415592553626032e-22,
          "open": 95648.32725486335
        },
        "volume": "7478963273.29806385",
        "volumeUsd": "2458733.3001615796"
      },
      {
        "Block": {
          "Time": "2025-05-04T00:00:00Z"
        },
        "Trade": {
          "close": 590.556980512934,
          "max": 641.2499935095461,
          "min": 8.409976725042349e-11,
          "open": 0.06653022273347002
        },
        "volume": "623305622.12220",
        "volumeUsd": "12960.37706433386"
      },
      {
        "Block": {
          "Time": "2025-05-04T00:00:00Z"
        },
        "Trade": {
          "close": 0.9887970729362358,
          "max": 593.8412531096817,
          "min": 7.397516860720871e-9,
          "open": 1.0017439471215601
        },
        "volume": "728270.643803522056",
        "volumeUsd": "751.8817054687463"
      },
      {
        "Block": {
          "Time": "2025-05-04T00:00:00Z"
        },
        "Trade": {
          "close": 584.3612975087789,
          "max": 128945933048027.02,
          "min": 1.0045262519475475e-20,
          "open": 0.9891298455505896
        },
        "volume": "1539360432480440.621183557",
        "volumeUsd": "989657.1399844958"
      },
      {
        "Block": {
          "Time": "2025-05-04T00:00:00Z"
        },
        "Trade": {
          "close": 1.0020310467291467,
          "max": 38927697509765630000,
          "min": 9.085516201726705e-32,
          "open": 592.454201656581
        },
        "volume": "23033706975675.460953621620738644",
        "volumeUsd": "341295550.6924142"
      },
      {
        "Block": {
          "Time": "2025-05-04T00:00:00Z"
        },
        "Trade": {
          "close": 574.8621362879807,
          "max": 1780.9289296413833,
          "min": 6.247934973788209e-19,
          "open": 599.4543777375976
        },
        "volume": "2225057961.7276",
        "volumeUsd": "12734.522166185283"
      }
    ]
  }
}


### Last price and token info 

```graphql
subscription {
        EVM(network: bsc) {
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
          "Time": "2025-05-05T14:36:14Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "2832.637361309",
            "Currency": {
              "Decimals": 9,
              "Fungible": true,
              "Name": "Haedal",
              "SmartContract": "0x3d9be0ac1001cd81c32464276d863d2ffdca4967",
              "Symbol": "HAEDAL"
            },
            "Price": 0.1473770190975815,
            "PriceInUSD": 0.14737347900256834
          },
          "Dex": {
            "ProtocolFamily": "PancakeSwap",
            "ProtocolName": "pancake_swap_v3"
          },
          "Sell": {
            "Amount": "417.465650494159369062",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "Name": "Tether USD",
              "SmartContract": "0x55d398326f99059ff775485246999027b3197955",
              "Symbol": "USDT"
            },
            "Price": 6.78531840393568,
            "PriceInUSD": 0
          }
        }
      },
      {
        "Block": {
          "Time": "2025-05-05T14:36:14Z"
        },
        "Trade": {
          "Buy": {
            "Amount": "0.508090943263867392",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "Name": "Bitcoin Cash Token",
              "SmartContract": "0x8ff795a6f4d97e7887c79bea79aba5cc76444adf",
              "Symbol": "BCH"
            },
            "Price": 0.5913137867874865,
            "PriceInUSD": 352.05297662651793
          },
          "Dex": {
            "ProtocolFamily": "PancakeSwap",
            "ProtocolName": "pancake_swap_v3"
          },
          "Sell": {
            "Amount": "0.300441179693783450",
            "Currency": {
              "Decimals": 18,
              "Fungible": true,
              "Name": "Wrapped BNB",
              "SmartContract": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
              "Symbol": "WBNB"
            },
            "Price": 1.691149474854697,
            "PriceInUSD": 596.1203840268988
          }
        }
      }
    ]
  }
}

### Price change 24h  BSC BNB/USDT

### Params example
```json
{
  "network": "bsc",
  "from": "2024-12-04T00:00:00",
  "limit": 100
}
```

```json
query getLegacyTokenCandles($limit: Int, $from: ISO8601DateTime) {
  ethereum(network: bsc) {
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
