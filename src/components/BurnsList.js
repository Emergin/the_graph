import React from 'react';

function BurnsList({ burns, loading }) {
  if (loading) {
    return <div className="data-section"><h2>Burns</h2><p>Loading burns...</p></div>;
  }

  return (
    <div className="data-section">
      <h2>Burns</h2>
      {burns.length > 0 ? (
        <ul>
          {burns.map((burn) => (
            <li key={burn.id} className="data-item">
              <p><strong>ID:</strong> {burn.id}</p>
              <p><strong>Burner:</strong> {burn.burner}</p>
              <p><strong>Value:</strong> {burn.value}</p>
              <p><strong>Block Number:</strong> {burn.blockNumber}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Burns Found</p>
      )}
    </div>
  );
}

export default BurnsList;