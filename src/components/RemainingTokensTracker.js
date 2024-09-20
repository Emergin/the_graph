import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const TOTAL_SUPPLY = 26000000; // 26 million LPT tokens

const RemainingTokensTracker = ({ burnCount, mintCount }) => {
  const [remainingTokens, setRemainingTokens] = useState(TOTAL_SUPPLY);

  useEffect(() => {
    const calculateRemainingTokens = () => {
      const circulatingSupply = mintCount - burnCount;
      const remaining = TOTAL_SUPPLY - circulatingSupply;
      setRemainingTokens(remaining);
    };

    calculateRemainingTokens();
  }, [burnCount, mintCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remaining LPT Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{remainingTokens.toLocaleString()} LPT</p>
      </CardContent>
    </Card>
  );
};

export default RemainingTokensTracker;