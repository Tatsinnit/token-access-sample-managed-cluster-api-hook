import React, { useState } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [clusters, setClusters] = useState([]);
  const [error, setError] = useState("");

  const fetchClusters = async () => {
    try {
      const response = await axios.post("http://localhost:4000/list-aks", {
        accessToken: token,
        subscriptionId,
      });
      setClusters(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch clusters: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AKS Cluster Viewer</h1>
      <textarea
        placeholder="Paste Access Token from 'az account get-access-token'"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        rows={5}
        style={{ width: "80%" }}
      />
      <br />
      <input
        type="text"
        placeholder="Subscription ID"
        value={subscriptionId}
        onChange={(e) => setSubscriptionId(e.target.value)}
        style={{ width: "80%", marginTop: 10 }}
      />
      <br />
      <button onClick={fetchClusters} style={{ marginTop: 10 }}>
        List AKS Clusters
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {clusters.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
