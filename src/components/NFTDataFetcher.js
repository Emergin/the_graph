import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache()
});

const GET_ENS_DATA = gql`
  query {
  _meta {
    block {
      number
    }
    deployment
    hasIndexingErrors
  }
  
  # Add your specific entity queries here, for example:
  # projects(first: 10) {
  #   id
  #   name
  #   description
  # }
  
  # users(first: 10) {
  #   id
  #   address
  # }
}
`;

const ENSDataDisplay = () => {
  const { loading, error, data } = useQuery(GET_ENS_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ENS Domains</h2>
      {data.domains.map((domain) => (
        <Card key={domain.id} className="mb-2">
          <CardHeader>
            <CardTitle>{domain.name || 'Unnamed Domain'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>ID: {domain.id}</p>
            <p>Label Name: {domain.labelName}</p>
            <p>Label Hash: {domain.labelhash}</p>
          </CardContent>
        </Card>
      ))}

      <h2 className="text-2xl font-bold my-4">Recent Transfers</h2>
      {data.transfers.map((transfer) => (
        <Card key={transfer.id} className="mb-2">
          <CardHeader>
            <CardTitle>Transfer {transfer.id.slice(0, 6)}...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Domain ID: {transfer.domain.id}</p>
            <p>Block Number: {transfer.blockNumber}</p>
            <p>Transaction ID: {transfer.transactionID.slice(0, 10)}...</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ENSDataFetcher = () => {
  const [dataFetched, setDataFetched] = useState(false);

  const handleFetch = () => {
    setDataFetched(true);
  };

  return (
    <ApolloProvider client={client}>
      <div className="p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>ENS Data Fetcher</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFetch} disabled={dataFetched}>
              {dataFetched ? 'Data Fetched' : 'Fetch ENS Data'}
            </Button>
          </CardContent>
        </Card>
        {dataFetched && <ENSDataDisplay />}
      </div>
    </ApolloProvider>
  );
};

export default ENSDataFetcher;

