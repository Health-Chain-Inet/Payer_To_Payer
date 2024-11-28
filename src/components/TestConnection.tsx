import React from 'react';
import { Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface TestResult {
  status: 'success' | 'failed' | 'pending';
  latency?: number;
  timestamp: string;
  details: {
    tlsVersion: string;
    certificateValid: boolean;
    fhirEndpointReachable: boolean;
    error?: string;
  };
}

interface TestConnectionProps {
  payerId: string;
  payerName: string;
  onClose: () => void;
}

export default function TestConnection({ payerId, payerName, onClose }: TestConnectionProps) {
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<TestResult | null>(null);

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);

    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock test result - replace with actual API call
    setTestResult({
      status: Math.random() > 0.3 ? 'success' : 'failed',
      latency: Math.floor(Math.random() * 200) + 50,
      timestamp: new Date().toISOString(),
      details: {
        tlsVersion: 'TLS 1.3',
        certificateValid: true,
        fhirEndpointReachable: true
      }
    });

    setTesting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Test Connection to {payerName}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Close</span>
          <XCircle className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Connection Details</h4>
              <p className="text-sm text-gray-500">ID: {payerId}</p>
            </div>
            <button
              onClick={runTest}
              disabled={testing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {testing ? (
                <>
                  <Activity className="animate-spin h-4 w-4 mr-2" />
                  Testing...
                </>
              ) : (
                'Run Test'
              )}
            </button>
          </div>
        </div>

        {testResult && (
          <div className="border rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Test Results</h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    testResult.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {testResult.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-1" />
                  )}
                  {testResult.status.charAt(0).toUpperCase() + testResult.status.slice(1)}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Latency</dt>
                  <dd className="mt-1 text-sm text-gray-900">{testResult.latency}ms</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">TLS Version</dt>
                  <dd className="mt-1 text-sm text-gray-900">{testResult.details.tlsVersion}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Certificate Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        testResult.details.certificateValid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {testResult.details.certificateValid ? 'Valid' : 'Invalid'}
                    </span>
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">FHIR Endpoint</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        testResult.details.fhirEndpointReachable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {testResult.details.fhirEndpointReachable ? 'Reachable' : 'Unreachable'}
                    </span>
                  </dd>
                </div>
              </dl>

              {testResult.details.error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Details</h3>
                      <div className="mt-2 text-sm text-red-700">
                        {testResult.details.error}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}