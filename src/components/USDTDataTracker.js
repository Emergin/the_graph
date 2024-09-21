import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Replace with your actual subgraph endpoint for USDT on Arbitrum
const APIURL = "https://api.thegraph.com/subgraphs/name/your-usdt-subgraph";

const query = `
  {
    token(id: "0xdAC17F958D2ee523a2206206994597C13D831ec7") { // USDT contract on Arbitrum
      totalSupply
    }
  }
`;

const RealTimeUSDTSupplyTracker = () => {
  const [supplyData, setSupplyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSupplyCounter, setTotalSupplyCounter] = useState(0);

  const fetchSupplyData = async () => {
    try {
      const response = await fetch(APIURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      if (result.data && result.data.token) {
        const newSupplyData = result.data.token.totalSupply;

        // Update the total supply counter
        setTotalSupplyCounter((prevCounter) => prevCounter + parseFloat(newSupplyData));

        setSupplyData(newSupplyData);
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch latest supply data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplyData();
    const interval = setInterval(fetchSupplyData, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTokens = (tokens) => {
    return (parseFloat(tokens) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 0 }) + " USDT"; // Adjust for USDT decimals
  };

  if (loading && !supplyData) return <p>Loading initial supply data...</p>;
  if (error && !supplyData) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-2 border-blue-600 bg-blue-50 p-4">
        <CardHeader className="border-b border-green-600 pb-2">
          <CardTitle className="text-blue-800">USDT Supply on Arbitrum</CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          {supplyData ? (
            <>
              <div className="border-t border-green-600 pt-2">
                <p className="font-bold">Accumulated Total Supply:</p>
                <p>Total Supply: {formatTokens(totalSupplyCounter)}</p>
              </div>
            </>
          ) : (
            <p>No supply data available</p>
          )}
          {loading && <p>Refreshing data...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>

      {/* Add more cards as needed for distribution or other statistics */}
    </div>
  );
};

export default RealTimeUSDTSupplyTracker;
