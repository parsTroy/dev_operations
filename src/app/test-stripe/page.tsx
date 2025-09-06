"use client";

import { useEffect, useState } from 'react';
import { testStripeConnection } from '~/lib/stripe';
import { checkStripeEnv } from '~/lib/env-check';

export default function TestStripePage() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [envCheck, setEnvCheck] = useState<boolean | null>(null);

  useEffect(() => {
    // Check environment variables first
    setEnvCheck(checkStripeEnv());
    
    // Then test Stripe connection
    testStripeConnection().then(setIsConnected);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold mb-6">Stripe Setup Test</h1>
        
        {/* Environment Variables Check */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          {envCheck === null && (
            <p className="text-gray-600">Checking...</p>
          )}
          {envCheck === true && (
            <div className="text-green-600">
              <p className="text-sm">✅ All environment variables loaded</p>
            </div>
          )}
          {envCheck === false && (
            <div className="text-red-600">
              <p className="text-sm">❌ Missing environment variables</p>
            </div>
          )}
        </div>

        {/* Stripe Connection Test */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Stripe Connection</h2>
          {isConnected === null && (
            <p className="text-gray-600">Testing connection...</p>
          )}
          {isConnected === true && (
            <div className="text-green-600">
              <p className="text-sm">✅ Stripe API connection successful</p>
            </div>
          )}
          {isConnected === false && (
            <div className="text-red-600">
              <p className="text-sm">❌ Stripe API connection failed</p>
            </div>
          )}
        </div>

        {/* Overall Status */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Overall Status</h3>
          {envCheck && isConnected ? (
            <div className="text-green-600">
              <p className="text-lg font-semibold"> Stripe is ready!</p>
              <p className="text-sm">You can proceed to the next step.</p>
            </div>
          ) : (
            <div className="text-red-600">
              <p className="text-lg font-semibold">⚠️ Setup incomplete</p>
              <p className="text-sm">Please check the issues above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}