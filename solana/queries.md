

### List of trending tokens

```json
query TrendingTokens {
  Solana {
    DEXTradeByTokens(limit: {count: 30}, orderBy: {descendingByField: "tradesCountWithUniqueTraders"}) {
      Trade {
        Currency {
          Name
          Symbol
          MintAddress
        }
      }
      tradesCountWithUniqueTraders: count(distinct: Transaction_Signer)
    }
  }
}
```
### Response 
```json
{
  "Solana": {
    "DEXTradeByTokens": [
      {
        "Trade": {
          "Currency": {
            "MintAddress": "So11111111111111111111111111111111111111112",
            "Name": "Wrapped Solana",
            "Symbol": "WSOL"
          }
        },
        "tradesCountWithUniqueTraders": "1019126"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "2ivzYvjnKqA4X3dVvPKr7bctGpbxwrXbbxm44TJCpump",
            "Name": "gorklon rust",
            "Symbol": "gorklon"
          }
        },
        "tradesCountWithUniqueTraders": "194153"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "11111111111111111111111111111111",
            "Name": "Solana",
            "Symbol": "SOL"
          }
        },
        "tradesCountWithUniqueTraders": "78856"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "HqHQZK1TYmQSgmGRD1GJdc657vYruEpd5iGEnGJoBXFj",
            "Name": "",
            "Symbol": ""
          }
        },
        "tradesCountWithUniqueTraders": "48645"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "5rX6WRhezyszRDQKSAAKMHDdH83GTYeyWESrQ8AyZREV",
            "Name": "Baby Gork",
            "Symbol": "BabyGork"
          }
        },
        "tradesCountWithUniqueTraders": "46268"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "Name": "USD Coin",
            "Symbol": "USDC"
          }
        },
        "tradesCountWithUniqueTraders": "45030"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "Dvknw5DQtb4hwq7ARWEnsh2G6TEgNiNLw4CE6JXfpump",
            "Name": "Trump's Fartcoin",
            "Symbol": "TRUMPFART"
          }
        },
        "tradesCountWithUniqueTraders": "39875"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "Ddm4DTxNZxABUYm2A87TFLY6GDG2ktM2eJhGZS3EbzHM",
            "Name": "DISTRIBUTE",
            "Symbol": "DISTRIBUTE"
          }
        },
        "tradesCountWithUniqueTraders": "38796"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "C6EjPrxHX7VsDXjRnJvzSvVVXoDoD3vTbybWNNvobonk",
            "Name": "Energy",
            "Symbol": "Energy"
          }
        },
        "tradesCountWithUniqueTraders": "35001"
      },
      {
        "Trade": {
          "Currency": {
            "MintAddress": "8hXPUGdsBfPY3kGUi3Qp3jt49QoqTzK3QuGzEsNTZREV",
            "Name": "PerpRugs",
            "Symbol": "PRUGS"
          }
        },
        "tradesCountWithUniqueTraders": "28681"
      },
      
```

### For token chart history 1 week
```json
{
    Solana(dataset: archive) {
      DEXTradeByTokens(
        orderBy: { descendingByField: "Block_Timefield" }
        where: {
          Trade: {
            Currency: {
              MintAddress: { is: "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui" }
            }
            Side: {
              Currency: {
                MintAddress: { is: "So11111111111111111111111111111111111111112" }
              }
            }
            PriceAsymmetry: { lt: 0.1 }
          }
        }
        limit: { count: 10 }
      ) {
        Block {
          Timefield: Time(interval: { in: days, count: 1 })
        }
        volume: sum(of: Trade_Amount)
        Trade {
          high: Price(maximum: Trade_Price)
          low: Price(minimum: Trade_Price)
          open: Price(minimum: Block_Slot)
          close: Price(maximum: Block_Slot)
        }
        count
      }
    }
  }
```
### Response 

```json
{
  "Solana": {
    "DEXTradeByTokens": [
      {
        "Block": {
          "Timefield": "2025-05-02T00:00:00Z"
        },
        "Trade": {
          "close": 0.000018604277854192203,
          "high": 0.000018697854406731625,
          "low": 0.00001827197357678729,
          "open": 0.000018626599817786315
        },
        "count": "92",
        "volume": "2344060.547418"
      },
      {
        "Block": {
          "Timefield": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 0.00001862699436636563,
          "high": 0.000019262421825965037,
          "low": 0.00001814324033556324,
          "open": 0.000018731334505539832
        },
        "count": "493",
        "volume": "15312526.360242"
      },....
```  

## For token chart 24h
### Parameters
```json
{
  "token": "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh"
}
```

```json
query ($token: String) {
  Solana(aggregates: no) {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Amount: {gt: "0"}, Side: {AmountInUSD: {gt: "0"}}, Currency: {MintAddress: {is: $token}}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time(interval: {count: 24, in: hours})
      }
      Trade {
        open: PriceInUSD(minimum: Block_Slot)
        close: PriceInUSD(maximum: Block_Slot)
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
  "Solana": {
    "DEXTradeByTokens": [
      {
        "Block": {
          "Time": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 96390.31807068772,
          "max": 102510.21102154072,
          "min": 93287.32688357445,
          "open": 96754.59368219196
        },
        "volume": "17827.566804246",
        "volumeUsd": "2683222.9964322224"
      },
      {
        "Block": {
          "Time": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 96168.12159814707,
          "max": 96925.88840845872,
          "min": 96135.16048601977,
          "open": 96685.87232094257
        },
        "volume": "1.49942804",
        "volumeUsd": "2906.3163229157226"
      },
      {
        "Block": {
          "Time": "2025-05-01T00:00:00Z"
        },
        "Trade": {
          "close": 96514.44462976528,
          "max": 99890.20536314567,
          "min": 95085.51459382584,
          "open": 96675.65453728373
        },
        "volume": "359240.370720",
        "volumeUsd": "340194.3093805757"
      },
      {
        "Block": {
          "Time": "2025-05-02T00:00:00Z"
        },
        "Trade": {
          "close": 96595.06741209906,
          "max": 98782.78776447123,
          "min": 72701.22414827708,
          "open": 96507.28244130143
        },
        "volume": "735355.219267",
        "volumeUsd": "751797.6276068521"
      },
      
```

### Last price and token info 
```json
subscription {
        Solana {
          DEXTrades {
            Block {
              Time
            }
            Instruction {
              Program {
                Method
              }
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
                Account {
                  Address
                }
                Currency {
                  Name
                  Symbol
                  MintAddress
                  Decimals
                  Fungible
                  Uri
                }
              }
              Sell {
                Price
                PriceInUSD
                Amount
                Account {
                  Address
                }
                Currency {
                  Name
                  Symbol
                  MintAddress
                  Decimals
                  Fungible
                  Uri
                }
              }
            }
            Transaction {
              Signature
              Fee
              FeeInUSD
              FeePayer
            }
          }
        }
      }
```

### Response 
```json
{
  "Solana": {
    "DEXTrades": [
      {
        "Block": {
          "Time": "2025-05-02T08:26:00Z"
        },
        "Instruction": {
          "Program": {
            "Method": "swap"
          }
        },
        "Trade": {
          "Buy": {
            "Account": {
              "Address": "G2U9UbB9mcAJTN9LrhpUxKrtNGknT4t63YNmD34LzWsd"
            },
            "Amount": "3738.825670373",
            "Currency": {
              "Decimals": 9,
              "Fungible": true,
              "MintAddress": "boopkpWqe68MSxLqBGogs8ZbUDN4GXaLhFwNP7mpP1i",
              "Name": "BOOP",
              "Symbol": "BOOP",
              "Uri": "https://boop.fun/boop/metadata.json"
            },
            "Price": 0.0026746366056169613,
            "PriceInUSD": 0.39980164831337495
          },
          "Dex": {
            "ProtocolFamily": "Meteora",
            "ProtocolName": "lb_clmm"
          },
          "Sell": {
            "Account": {
              "Address": "8oWDgfgeswb6TkW9oTmkZU3ZzPYckrSr6zXZBQF4kNYs"
            },
            "Amount": "10.000000000",
            "Currency": {
              "Decimals": 9,
              "Fungible": true,
              "MintAddress": "So11111111111111111111111111111111111111112",
              "Name": "Wrapped Solana",
              "Symbol": "WSOL",
              "Uri": ""
            },
            "Price": 373.88256703729996,
            "PriceInUSD": 149.38743932852688
          }
        },
        "Transaction": {
          "Fee": "0.000005000",
          "FeeInUSD": "0.0007473943328857423",
          "FeePayer": "AiQZH7jfGgDL7aLpckzLzRE6Gyv6QwuXQ9oXDY6EQvpX",
          "Signature": "tQ33kNFGEFvKZdSdpt2Lg99RhYPbNdMJ31pFaZXP9uLs1TiQoLdykQzJHbreYiNWeyQa6ScpNS3BuM6wGWKwFMK"
        }
```
### 24H volume for pair
```json
{
  Solana(dataset: combined) {
    buys: DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, PriceAsymmetry: {lt: 0.1}}, Block: {Time: {since: "2025-04-23T14:54:51Z", till: "2025-04-24T15:54:51Z"}}}
    ) {
      volume: sum(
        of: Trade_AmountInUSD
        if: {Block: {Time: {since: "2025-04-23T14:54:51Z", till: "2025-04-24T15:54:51Z"}}}
      )
    }
    sells: DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}, Side: {Currency: {MintAddress: {is: "Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump"}}}, PriceAsymmetry: {lt: 0.1}}, Block: {Time: {since: "2025-04-23T14:54:51Z", till: "2025-04-24T15:54:51Z"}}}
    ) {
      volume: sum(
        of: Trade_AmountInUSD
        if: {Block: {Time: {since: "2025-04-23T14:54:51Z", till: "2025-04-24T15:54:51Z"}}}
      )
    }
  }
}

```
### Response 
```json
{
  "Solana": {
    "buys": [
      {
        "volume": "538.6691116177997"
      }
    ],
    "sells": [
      {
        "volume": "566.3312670853641"
      }
    ]
  }
}
```

### 24H metrics for token

### Params example 
```json
{
  "address": "Dezkhsv7U4Z1KMp65HhzAGp9UkNTaB9yPvr7ttLCpump",
  "pair_address": "B4kXZHHmC6aDjFRd7Fgde3HU85q2vMzbN7MxwheGnPHo",
  "time_24h_ago": "2025-01-01T04:30:15Z"
}
```

```json
query MyQuery($address: String!, $pair_address: String!, $time_24h_ago: DateTime!) {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: {is: $address}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}, Market: {MarketAddress: {is: $pair_address}}}, Block: {Time: {since: $time_24h_ago}}}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        usd_24h: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: $time_24h_ago}}}
        )
        Dex {
          ProtocolName
          ProtocolFamily
          ProgramAddress
        }
        Market {
          MarketAddress
        }
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
      trades_total: count
      trades_24h: count(if: {Block: {Time: {after: $time_24h_ago}}})
      traded_volume_total: sum(of: Trade_Side_AmountInUSD)
      traded_volume_24h: sum(
        of: Trade_Side_AmountInUSD
        if: {Block: {Time: {after: $time_24h_ago}}}
      )
      buy_volume_total: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buy_volume_24h: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_24h_ago}}}
      )
      sell_volume_total: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
      sell_volume_24h: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_24h_ago}}}
      )
      buys_total: count(if: {Trade: {Side: {Type: {is: buy}}}})
      buys_24h: count(
        if: {Trade: {Side: {Type: {is: buy}}}, Block: {Time: {after: $time_24h_ago}}}
      )
      sells_total: count(if: {Trade: {Side: {Type: {is: sell}}}})
      sells_24h: count(
        if: {Trade: {Side: {Type: {is: sell}}}, Block: {Time: {after: $time_24h_ago}}}
      )
    }
  }
}

```
### Response 
```json
{
  "Solana": {
    "DEXTradeByTokens": [
      {
        "Trade": {
          "Currency": {
            "MintAddress": "Dezkhsv7U4Z1KMp65HhzAGp9UkNTaB9yPvr7ttLCpump",
            "Name": "Sleepless AI",
            "Symbol": "SLEEP"
          },
          "Dex": {
            "ProgramAddress": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
            "ProtocolFamily": "Raydium",
            "ProtocolName": "raydium_amm"
          },
          "Market": {
            "MarketAddress": "B4kXZHHmC6aDjFRd7Fgde3HU85q2vMzbN7MxwheGnPHo"
          },
          "Side": {
            "Currency": {
              "MintAddress": "So11111111111111111111111111111111111111112",
              "Name": "Wrapped Solana",
              "Symbol": "WSOL"
            }
          },
          "usd_24h": 0.00008901698666534226
        },
        "buy_volume_24h": "374306.54041122494",
        "buy_volume_total": "374306.54041122494",
        "buys_24h": "3365",
        "buys_total": "3365",
        "sell_volume_24h": "383089.5568122445",
        "sell_volume_total": "383089.5568122445",
        "sells_24h": "2698",
        "sells_total": "2698",
        "traded_volume_24h": "757396.0972234695",
        "traded_volume_total": "757396.0972234695",
        "trades_24h": "6063",
        "trades_total": "6063"
      }
    ]
  }
}
```

### Price change  
```json
{
  Solana {
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: "6n7Janary9fqzxKaJVrhL9TG2F61VbAtwUMu1YZscaQS"}}, Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}}
    ) {
      Block {
        latest_time: Time(maximum: Block_Slot)
        start_time: Time(minimum: Block_Slot)
      }
      Trade {
        latestPirce: Price(maximum: Block_Slot)
        startPirce: Price(minimum: Block_Slot)
      }
    }
  }
}


```

### Response 
```json
{
  "Solana": {
    "DEXTradeByTokens": [
      {
        "Block": {
          "latest_time": "2025-05-02T12:01:00Z",
          "start_time": "2025-05-02T12:01:00Z"
        },
        "Trade": {
          "latestPirce": 0.00001862699436636563,
          "startPirce": 0.000018731334505539832
        }
      }
    ]
  }
}
```
