// backend/server.js
const express = require("express");
const { ContainerServiceClient } = require("@azure/arm-containerservice");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/list-aks", async (req, res) => {
  const { accessToken, subscriptionId } = req.body;

  if (!accessToken || !subscriptionId) {
    return res.status(400).json({ error: "Missing accessToken or subscriptionId" });
  }

  const client = new ContainerServiceClient(
    {
      getToken: async () => ({
        token: accessToken,
        expiresOnTimestamp: Date.now() + 3600000,
      }),
    },
    subscriptionId
  );

  try {
    const clusters = [];
    for await (const cluster of client.managedClusters.list()) {
      clusters.push(cluster);
    }
    res.json(clusters);
  } catch (err) {
    console.error("Error fetching clusters", err.message);
    res.status(500).json({ error: err.message });
  }
});

const port = 4000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
