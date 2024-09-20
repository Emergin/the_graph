import React from 'react';

function MintsList({ mints, loading }) {
  if (loading) {
    return <div className="data-section"><h2>Mints</h2><p>Loading mints...</p></div>;
  }

  return (
    <div className="data-section">
      <h2>Mints</h2>
      {mints.length > 0 ? (
        <ul>
          {mints.map((mint) => (
            <li key={mint.id} className="data-item">
              <p><strong>ID:</strong> {mint.id}</p>
              <p><strong>To:</strong> {mint.to}</p>
              <p><strong>Amount:</strong> {mint.amount}</p>
              <p><strong>Block Number:</strong> {mint.blockNumber}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Mints Found</p>
      )}
    </div>
  );
}

export default MintsList;