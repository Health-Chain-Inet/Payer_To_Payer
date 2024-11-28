import React from 'react';
import { FileCheck, Calendar, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface AttestationStatus {
  resource: string;
  lastAttested: string;
  nextDue: string;
  status: 'completed' | 'pending' | 'overdue';
  compliance: number;
}

const attestationItems: AttestationStatus[] = [
  {
    resource: 'Patient Demographics',
    lastAttested: '2024-02-15',
    nextDue: '2024-08-15',
    status: 'completed',
    compliance: 98
  },
  {
    resource: 'Claims Data',
    lastAttested: '2024-01-20',
    nextDue: '2024-07-20',
    status: 'pending',
    compliance: 85
  },
  {
    resource: 'Clinical Information',
    lastAttested: '2023-12-01',
    nextDue: '2024-06-01',
    status: 'overdue',
    compliance: 75
  }
];

export default function Attestation() {
  const [selectedItem, setSelectedItem] = React.useState<AttestationStatus | null>(null);
  const [isAttesting, setIsAttesting] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'overdue':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleAttest = async () => {
    setIsAttesting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAttesting(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Attestation Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track attestation requirements for payer-to-payer data exchange
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <FileCheck className="h-4 w-4 mr-2" />
              Bulk Attest
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resource
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Attested
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Next Due
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compliance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attestationItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.resource}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.lastAttested).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.nextDue).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${item.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : item.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                              {item.status === 'completed' && <CheckCircle className="h-4 w-4 mr-1" />}
                              {item.status === 'pending' && <RefreshCw className="h-4 w-4 mr-1" />}
                              {item.status === 'overdue' && <AlertTriangle className="h-4 w-4 mr-1" />}
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${item.compliance >= 90
                                      ? 'bg-green-500'
                                      : item.compliance >= 70
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                  style={{ width: `${item.compliance}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                {item.compliance}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attestation Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Attestation Details - {selectedItem.resource}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{selectedItem.status}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Compliance Rate</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedItem.compliance}%</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Required Actions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Review and verify data accuracy</li>
                      <li>Confirm compliance with privacy standards</li>
                      <li>Update documentation if needed</li>
                      <li>Sign attestation statement</li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAttest}
                  disabled={isAttesting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {isAttesting ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Attesting...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4 mr-2" />
                      Complete Attestation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}