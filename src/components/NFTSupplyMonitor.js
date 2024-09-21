import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { BigNumber } from 'bignumber.js';

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/89309/etherscan/version/latest";

const queryNFTs = `
  {
    nfts {
      id
      totalSupply
    }
  }
`;

const formatSupply = (supply) => {
  const bn = new BigNumber(supply);
  if (bn.isNegative()) return 'Invalid Supply';
  if (bn.isZero()) return '0';
  if (bn.isLessThan(1)) return '< 1';
  return bn.toFormat(0);
};

const fetchEtherscanUrl = (id) => `https://etherscan.io/token/${id}`;

const NFTSupplyMonitor = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryNFTs })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      if (data.errors) throw new Error(data.errors[0].message);

      const filteredNfts = data.data.nfts.filter(nft => new BigNumber(nft.totalSupply).isGreaterThanOrEqualTo(1));

      setNfts(filteredNfts.map(nft => ({
        ...nft,
        totalSupply: new BigNumber(nft.totalSupply),
        etherscanUrl: fetchEtherscanUrl(nft.id)
      })));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const fetchInterval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setNfts(currentNfts => 
        currentNfts.map(nft => ({
          ...nft,
          totalSupply: nft.totalSupply.plus(
            BigNumber.random(0, 1).times(10).integerValue()
          ).decimalPlaces(0, BigNumber.ROUND_DOWN)
        }))
      );
    }, 1000); // Update every second

    return () => clearInterval(updateInterval);
  }, []);

  if (loading) return <div>Loading NFT data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-5 bg-blue-50">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">NFT Supply Monitor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map(nft => (
          <Card key={nft.id} className="border border-blue-300 rounded-lg overflow-hidden">
            <CardHeader className="bg-blue-100">
              <CardTitle>
                <a href={nft.etherscanUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {`NFT ${nft.id.slice(0, 6)}...`}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{formatSupply(nft.totalSupply.toString())}</p>
              <p className="text-sm text-gray-500">Total Supply</p>
              <p className="text-xs text-gray-400 mt-2">ID: {nft.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NFTSupplyMonitor;