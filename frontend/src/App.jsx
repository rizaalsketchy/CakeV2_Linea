// App.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const App = () => {
  const [address, setAddress] = useState('');
  const [positions, setPositions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPositions = async () => {
    if (!address) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/get-positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }

      const data = await response.json();
      setPositions(data);
    } catch (err) {
      setError('Failed to fetch positions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>PancakeSwap v2 LP Position Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Enter wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={fetchPositions}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Check Positions'}
              </Button>
            </div>
            
            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}

            {positions && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded shadow">
                    <h3 className="font-bold mb-2">Total Value</h3>
                    <p>${positions.total_usd_value.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-white rounded shadow">
                    <h3 className="font-bold mb-2">Protocol</h3>
                    <p>{positions.protocol_name}</p>
                  </div>
                </div>

                {positions.positions.map((position, index) => (
                  <Card key={index} className="mt-4">
                    <CardHeader>
                      <CardTitle>Position {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Pool Address:</strong> {position.address}</p>
                        <p><strong>Total Value:</strong> ${position.balance_usd.toFixed(2)}</p>
                        <p><strong>Share of Pool:</strong> {position.position_details.share_of_pool.toFixed(2)}%</p>
                        
                        <h4 className="font-bold mt-4 mb-2">Tokens:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {position.tokens.filter(token => token.token_type !== 'defi-token').map((token, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded">
                              <p><strong>{token.name} ({token.symbol})</strong></p>
                              <p>Amount: {parseFloat(token.balance_formatted).toFixed(6)}</p>
                              <p>Value: ${token.usd_value?.toFixed(2) || '0'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
