const { WebSocket } = require("ws");
dotenv = require("dotenv");
dotenv.config();

const token = process.env.BITQUERY_ACCESS_TOKEN;
const bitqueryConnection = new WebSocket(
    "wss://streaming.bitquery.io/eap?token=" + token,
    ["graphql-ws"]
);

bitqueryConnection.on("open", () => {
    console.log("Connected to Bitquery.");

    // Send initialization message (connection_init)
    const initMessage = JSON.stringify({ type: "connection_init" });
    bitqueryConnection.send(initMessage);
});

bitqueryConnection.on("message", (data) => {
    const response = JSON.parse(data);

    // Handle connection acknowledgment (connection_ack)
    if (response.type === "connection_ack") {
        console.log("Connection acknowledged by server.");

        // Send subscription message after receiving connection_ack
        const subscriptionMessage = JSON.stringify({
            type: "start",
            id: "1",
            payload: {
                query: `
{
  EVM(dataset: realtime, network: bsc) {
    Transfers(
      orderBy: {descending: Block_Time}
      limit: {count: 10}
      where: {Transaction: {To: {is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b"}}, Transfer: {Sender: {is: "0x0000000000000000000000000000000000000000"}}}
    ) {
      Transfer {
        Amount
        AmountInUSD
        Currency {
          Name
          Symbol
          SmartContract
          Decimals
        }
        Id
        Index
        Success
        Type
        URI
        Sender
        Receiver
      }
      Call {
        From
        Value
        To
        Signature {
          Name
          Signature
        }
      }
      Log {
        SmartContract
        Signature {
          Name
        }
      }
      TransactionStatus {
        Success
      }
      Transaction {
        Hash
        From
        To
      }
      Block {
        Time
        Number
      }
    }
  }
}

                `,
            },
        });

        bitqueryConnection.send(subscriptionMessage);
        console.log("Subscription message sent.");

        //add stop logic
        setTimeout(() => {
            const stopMessage = JSON.stringify({ type: "stop", id: "1" });
            bitqueryConnection.send(stopMessage);
            console.log("Stop message sent after 10 seconds.");

            setTimeout(() => {
                console.log("Closing WebSocket connection.");
                bitqueryConnection.close();
            }, 1000);
        }, 10000);
    }

    // Handle received data
    if (response.type === "data") {
        console.log("Received data from Bitquery: ", response.payload.data);
        console.dir(response.payload.data, { depth: null });
    }

    // Handle keep-alive messages (ka)
    if (response.type === "ka") {
        console.log("Keep-alive message received.");
        // No action required; just acknowledgment that the connection is alive.
    }

    if (response.type === "error") {
        console.error("Error message received:", response.payload.errors);
    }
});

bitqueryConnection.on("close", () => {
    console.log("Disconnected from Bitquery.");
});

bitqueryConnection.on("error", (error) => {
    console.error("WebSocket Error:", error);
});
