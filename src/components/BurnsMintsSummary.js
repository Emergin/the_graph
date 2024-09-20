import React from 'react';

function BurnsMintsSummary({ burnCount, mintCount, loading }) {
  if (loading) {
    return <div className="summary">Loading summary...</div>;
  }

  return (
    <div className="summary">
      <div className="counter">
        <h2>Total Burns</h2>
        <div className="count">{burnCount}</div>
      </div>
      <div className="counter">
        <h2>Total Mints</h2>
        <div className="count">{mintCount}</div>
      </div>
    </div>
  );
}

export default BurnsMintsSummary;