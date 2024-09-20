import React from 'react';

function LatestEvents({ title, events, loading }) {
  if (loading) {
    return <div className="data-section"><h2>{title}</h2><p>Loading events...</p></div>;
  }

  return (
    <div className="data-section">
      <h2>{title}</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id} className="data-item">
              <p><strong>ID:</strong> {event.id}</p>
              <p><strong>{event.burner ? 'Burner' : 'To'}:</strong> {event.burner || event.to}</p>
              <p><strong>{event.value ? 'Value' : 'Amount'}:</strong> {event.value || event.amount}</p>
              <p><strong>Block Number:</strong> {event.blockNumber}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No {title} Found</p>
      )}
    </div>
  );
}

export default LatestEvents;