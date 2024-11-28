import React from 'react';
import {
  Database,
  Calendar,
  Clock,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  Settings,
  RefreshCw
} from 'lucide-react';

interface DataExchangeJob {
  id: string;
  sourcePayer: string;
  targetPayer: string;
  status: 'completed' | 'in-progress' | 'failed' | 'scheduled';
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    nextRun: string;
    lastRun?: string;
  };
  metrics?: {
    recordsProcessed: number;
    successRate: number;
    duration: string;
  };
}

const mockJobs: DataExchangeJob[] = [
  {
    id: '1',
    sourcePayer: 'Blue Cross Blue Shield',
    targetPayer: 'Aetna',
    status: 'completed',
    schedule: {
      frequency: 'daily',
      nextRun: '2024-03-16T00:00:00Z',
      lastRun: '2024-03-15T00:00:00Z'
    },
    metrics: {
      recordsProcessed: 15000,
      successRate: 99.8,
      duration: '45 minutes'
    }
  },
  {
    id: '2',
    sourcePayer: 'Blue Cross Blue Shield',
    targetPayer: 'UnitedHealth',
    status: 'scheduled',
    schedule: {
      frequency: 'weekly',
      nextRun: '2024-03-20T00:00:00Z',
      lastRun: '2024-03-13T00:00:00Z'
    }
  }
];

export default function BulkDataExchange() {
  const [jobs, setJobs] = React.useState<DataExchangeJob[]>(mockJobs);
  const [showSettings, setShowSettings] = React.useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            In Progress
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Calendar className="h-4 w-4 mr-1" />
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Data Exchange</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor bulk data exchange operations between payers
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <Database className="h-4 w-4 mr-2" />
              New Exchange
            </button>
          </div>
        </div>

        {/* Exchange Jobs */}
        <div className="mt-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exchange Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Metrics
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <ArrowUpDown className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {job.sourcePayer}
                                </div>
                                <div className="text-sm text-gray-500">
                                  to {job.targetPayer}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                {job.schedule.frequency}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                Next: {new Date(job.schedule.nextRun).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(job.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {job.metrics ? (
                              <div className="text-sm text-gray-900">
                                <div>{job.metrics.recordsProcessed.toLocaleString()} records</div>
                                <div className="text-sm text-gray-500">
                                  {job.metrics.successRate}% success rate
                                </div>
                                <div className="text-sm text-gray-500">
                                  Duration: {job.metrics.duration}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No metrics available</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-indigo-600 hover:text-indigo-900">
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
    </div>
  );
}