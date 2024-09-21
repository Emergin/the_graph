import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Make sure to replace this with your actual subgraph endpoint
const APIURL = "https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-arbitrum";

const query = `
  {
    graphNetwork(id: "1") {
      totalSupply
      totalTokensStaked
      totalTokensSignalled
      totalDelegatedTokens
    }
  }
`;

const RealTimeTokenSupplyTracker = () => {
  const [supplyData, setSupplyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to store the accumulated counters for each entity
  const [counters, setCounters] = useState({
    totalSupplyCounter: 0,
    totalTokensStakedCounter: 0,
    totalTokensSignalledCounter: 0,
    totalDelegatedTokensCounter: 0
  });

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
      if (result.data && result.data.graphNetwork) {
        const newSupplyData = result.data.graphNetwork;

        // Update counters by adding the new values (converted to numbers)
        setCounters((prevCounters) => ({
          totalSupplyCounter: prevCounters.totalSupplyCounter + parseFloat(newSupplyData.totalSupply),
          totalTokensStakedCounter: prevCounters.totalTokensStakedCounter + parseFloat(newSupplyData.totalTokensStaked),
          totalTokensSignalledCounter: prevCounters.totalTokensSignalledCounter + parseFloat(newSupplyData.totalTokensSignalled),
          totalDelegatedTokensCounter: prevCounters.totalDelegatedTokensCounter + parseFloat(newSupplyData.totalDelegatedTokens)
        }));

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
    // Fetch data every 30 seconds
    const interval = setInterval(fetchSupplyData, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTokens = (tokens) => {
    return (parseFloat(tokens) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 0 }) + " GRT";
  };

  const calculatePercentages = (data) => {
    const totalSupply = parseFloat(data.totalSupply);
    const totalStaked = parseFloat(data.totalTokensStaked);
    const totalSignalled = parseFloat(data.totalTokensSignalled);
    const totalDelegated = parseFloat(data.totalDelegatedTokens);

    return {
      staked: totalSupply > 0 ? ((totalStaked / totalSupply) * 100).toFixed(2) : 0,
      signalled: totalSupply > 0 ? ((totalSignalled / totalSupply) * 100).toFixed(2) : 0,
      delegated: totalSupply > 0 ? ((totalDelegated / totalSupply) * 100).toFixed(2) : 0,
      circulating: totalSupply > 0 ? (((totalSupply - (totalStaked + totalSignalled + totalDelegated)) / totalSupply) * 100).toFixed(2) : 0,
    };
  };

  const percentages = supplyData ? calculatePercentages(supplyData) : {};

  if (loading && !supplyData) return <p>Loading initial supply data...</p>;
  if (error && !supplyData) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <h1 className="text-2xl font-bold mb-4">Graph Arbitrum Network Token Supply</h1>
      <Card className="border-2 border-blue-600 bg-blue-50 p-4">
        <CardHeader className="border-b border-green-600 pb-2">
          <CardTitle className="text-blue-800">GRT Supply on Arbitrum</CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          {supplyData ? (
            <>
              <div className="border-t border-green-600 pt-2">
                <p className="font-bold">Accumulated Totals:</p>
                <p>Total Supply: {formatTokens(counters.totalSupplyCounter)}</p>
                <p>Total Tokens Staked: {formatTokens(counters.totalTokensStakedCounter)}</p>
                <p>Total Tokens Signalled: {formatTokens(counters.totalTokensSignalledCounter)}</p>
                <p>Total Delegated Tokens: {formatTokens(counters.totalDelegatedTokensCounter)}</p>
              </div>
            </>
          ) : (
            <p>No supply data available</p>
          )}
          {loading && <p>Refreshing data...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>

      <Card className="border-2 border-green-600 bg-green-50 p-4">
        <CardHeader className="border-b border-blue-600 pb-2">
          <CardTitle className="text-green-800">Supply Distribution</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          {supplyData && (
            <div className="space-y-2">
              <div className="bg-blue-200 p-2 border border-blue-600">
                <p>Staked: {percentages.staked}%</p>
              </div>
              <div className="bg-green-200 p-2 border border-green-600">
                <p>Signalled: {percentages.signalled}%</p>
              </div>
              <div className="bg-blue-200 p-2 border border-blue-600">
                <p>Delegated: {percentages.delegated}%</p>
              </div>
              <div className="bg-green-200 p-2 border border-green-600">
                <p>Circulating: {percentages.circulating}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Styled JSX for CSS */}
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .card {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          padding-bottom: 1rem;
          border-bottom: 2px solid;
        }

        .card-content {
          padding: 1rem;
        }

        .font-bold {
          font-weight: bold;
        }

        .text-red-500 {
          color: #ef4444;
        }

        .text-blue-800 {
          color: #1e40af;
        }

        .text-green-800 {
          color: #065f46;
        }

        .border-blue-600 {
          border-color: #2563eb;
        }

        .border-green-600 {
          border-color: #059669;
        }

        .bg-blue-50 {
          background-color: #ebf8ff;
        }

        .bg-green-50 {
          background-color: #f0fdf4;
        }

        .bg-blue-200 {
          background-color: #bfdbfe;
        }

        .bg-green-200 {
          background-color: #bbf7d0;
        }

        .p-2 {
          padding: 0.5rem;
        }

        .p-4 {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default RealTimeTokenSupplyTracker;
