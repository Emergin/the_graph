import React, { useEffect, useState } from 'react';
import './App.css';
import BurnsMintsSummary from './components/BurnsMintsSummary';
import RemainingTokensTracker from './components/RemainingTokensTracker';
import RealTimeTokenSupplyTracker from './components/RealTimeTokenSupplyTracker';
import NFTSupplyMonitor from './components/NFTSupplyMonitor';
import USDTDataTracker from './components/USDTDataTracker'

const APIURL = "https://api.studio.thegraph.com/query/89309/etherscan/version/latest";

const query = `
  query Subgraphs($lastId: ID) {
    burns(first: null, where: { id_gt: $lastId }, orderBy: id, orderDirection: asc) {
      id
    }
    mints(first: null, where: { id_gt: $lastId }, orderBy: id, orderDirection: asc) {
      id
    }
  }
`;

function App() {
  const [burnCount, setBurnCount] = useState(() => {
    // Retrieve initial burn count from local storage or set to 0
    const savedBurnCount = localStorage.getItem('burnCount');
    return savedBurnCount ? parseInt(savedBurnCount) : 0;
  });

  const [mintCount, setMintCount] = useState(() => {
    // Retrieve initial mint count from local storage or set to 0
    const savedMintCount = localStorage.getItem('mintCount');
    return savedMintCount ? parseInt(savedMintCount) : 0;
  });

  const [lastId, setLastId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(APIURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { lastId }
        }),
      });

      const result = await response.json();
      console.log('response:', result);

      if (result.data) {
        const newBurns = result.data.burns || [];
        const newMints = result.data.mints || [];

        setBurnCount(prevCount => {
          const newCount = prevCount + newBurns.length;
          localStorage.setItem('burnCount', newCount); // Save to local storage
          return newCount;
        });

        setMintCount(prevCount => {
          const newCount = prevCount + newMints.length;
          localStorage.setItem('mintCount', newCount); // Save to local storage
          return newCount;
        });

        // Update lastId for next query
        const allIds = [...newBurns, ...newMints].map(item => item.id);
        if (allIds.length > 0) {
          setLastId(Math.max(...allIds.map(id => parseInt(id))).toString());
        }
      } else {
        console.log('No data found in response');
        setError('No data found in response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling every 10 seconds
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Livepeer Contract Data</h1>
      <BurnsMintsSummary burnCount={burnCount} mintCount={mintCount} loading={loading} />
      {error && <p className="error">{error}</p>}
      <RemainingTokensTracker burnCount={burnCount} mintCount={mintCount} />
      <RealTimeTokenSupplyTracker/>
      <NFTSupplyMonitor/>
      <USDTDataTracker/>
    </div>
  );
}

export default App;
