import React from 'react';
import { Link2, CheckCircle2, AlertTriangle } from 'lucide-react';
import TestConnection from './TestConnection';

interface Connection {
  id: string;
  targetPayer: string;
  status: 'connected' | 'pending' | 'failed';
  lastChecked: string;
  metrics: {
    latency: number;
    uptime: string;
    requestsPerDay: number;
  };
}

const mockConnections: Connection[] = [
  {
    id: '1',
    targetPayer: 'Blue Cross Blue Shield',
    status: 'connected',
    lastChecked: '2024-03-15T10:00:00Z',
    metrics: {
      latency: 120,
      uptime: '99.9%',
      requestsPerDay: 1500
    }
  },
  {
    id: '2',
    targetPayer: 'Aetna',
    status: 'pending',
    lastChecked: '2024-03-15T09:45:00Z',
    metrics: {
      latency: 0,
      uptime: '-',
      requestsPerDay: 0
    }
  }
];

export default function PayerConnection() {
  const [connections, setConnections] = React.useState<Connection[]>(mockConnections);
  const [testingConnection, setTestingConnection] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Active Connections</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Link2 className="h-5 w-5 mr-2" />
            New Connection
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {connection.targetPayer}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    connection.status
                  )}`}
                >
                  {connection.status === 'connected' ? (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-1" />
                  )}
                  {connection.status}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Latency</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {connection.metrics.latency > 0
                      ? `${connection.metrics.latency}ms`
                      : '-'}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Uptime</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {connection.metrics.uptime}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Requests/Day
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {connection.metrics.requestsPerDay.toLocaleString()}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Last Checked
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(connection.lastChecked).toLocaleString()}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  View Details
                </button>
                <button
                  onClick={() => setTestingConnection({
                    id: connection.id,
                    name: connection.targetPayer
                  })}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Test Connection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {testingConnection && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <TestConnection
              payerId={testingConnection.id}
              payerName={testingConnection.name}
              onClose={() => setTestingConnection(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}