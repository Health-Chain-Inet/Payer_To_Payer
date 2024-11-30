import React, { useEffect, useState } from 'react';
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  FileText,
  Globe,
  Phone,
  Mail,
  Calendar,
  Server,
  Database,
  Lock,
  Clock,
  Activity,
  Users,
  BookOpen,
  Zap,
  Network
} from 'lucide-react';
import type { Payer } from '../types';
import config from '../config/config.js';

import { GlobalContext } from './GlobalContext';
// Mock data moved to a separate file for clarity
import { mockPayers } from '../data/mockPayers';
import { useNavigate } from 'react-router-dom';


export default function PayerDirectory() {
  const { globalVariable } = React.useContext(GlobalContext);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPayer, setSelectedPayer] = React.useState<Payer | null>(null);
  const [filterCriteria, setFilterCriteria] = React.useState({
    trustLevel: 'all',
    attestationStatus: 'all',
    dataTypes: 'all',
    exchangeFrameworks: 'all'
  });

  const [show, setShow] = React.useState(1);


  const [payers] = React.useState<Payer[]>(mockPayers);

  // 1. Memoize filtered results
  const filteredPayers = React.useMemo(() => {
    return payers.filter(payer => {
      const matchesSearch =
        payer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payer.ein.includes(searchTerm) ||
        payer.organization.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTrustLevel =
        filterCriteria.trustLevel === 'all' ||
        payer.attestation.trustFrameworkLevel === filterCriteria.trustLevel;

      const matchesAttestationStatus =
        filterCriteria.attestationStatus === 'all' ||
        payer.attestation.status === filterCriteria.attestationStatus;

      return matchesSearch && matchesTrustLevel && matchesAttestationStatus;
    });
  }, [payers, searchTerm, filterCriteria]);



  const handleDownloadCertificate = (payerId: string) => {
    // Implementation for certificate download
    console.log(`Downloading certificate for payer ${payerId}`);
  };

  const renderMetricsSection = React.useCallback((payer: Payer) => (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="text-sm font-medium text-gray-900">Availability</h4>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Uptime</span>
            <span className="text-sm font-medium text-gray-900">{payer.availabilityMetrics.uptime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Response Time</span>
            <span className="text-sm font-medium text-gray-900">{payer.availabilityMetrics.responseTime}ms</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900">Rate Limits</h4>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Requests/min</span>
            <span className="text-sm font-medium text-gray-900">{payer.rateLimit.requestsPerMinute}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Daily Limit</span>
            <span className="text-sm font-medium text-gray-900">{payer.rateLimit.dailyLimit}</span>
          </div>
        </div>
      </div>
    </div>
  ), []);



  const renderSecuritySection = React.useCallback((payer: Payer) => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Security Frameworks</h4>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(payer.securityFrameworks).map(([framework, supported]) => (
          <div key={framework} className="flex items-center justify-between">
            <span className="text-sm capitalize">{framework.replace(/([A-Z])/g, ' $1')}</span>
            {supported ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  ), []);

  const renderExchangeFrameworks = React.useCallback((payer: Payer) => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Exchange Frameworks</h4>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(payer.exchangeFrameworks).map(([framework, supported]) => (
          <div key={framework} className="flex items-center justify-between">
            <span className="text-sm capitalize">{framework}</span>
            {supported ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  ), []);

  const renderSupportedVersions = React.useCallback((payer: Payer) => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Supported Versions</h4>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(payer.attestation.supportedVersions).map(([category, versions]) => (
          <div key={category} className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700 capitalize">{category}</h5>
            <div className="flex flex-wrap gap-2">
              {versions.map((version, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {version}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ), []);

  useEffect(() => {
    // Fetch payer data from API
    console.log('use effect')
    const fetchPayerData = async () => {
  
      const user = localStorage.getItem('user');
      const email = localStorage.getItem('email');
      console.log('user=', user, 'email=', email);
      if (!user || !email) {
        setShow(0);
        navigate('/login')
      }
    };
   
    fetchPayerData();
  }, [navigate]);
  // (show == 0)? return(<></>): null;
  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payer Directory
            </h3>
            <div className="flex space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Network className="h-4 w-4 mr-2" />
                Exchange Framework
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <Users className="h-4 w-4 mr-2" />
                Add Payer
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by payer name, EIN, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterCriteria.trustLevel}
                onChange={(e) => setFilterCriteria(prev => ({ ...prev, trustLevel: e.target.value }))}
              >
                <option value="all">All Trust Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterCriteria.attestationStatus}
                onChange={(e) => setFilterCriteria(prev => ({ ...prev, attestationStatus: e.target.value }))}
              >
                <option value="all">All Attestation Statuses</option>
                <option value="attested">Attested</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>

              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterCriteria.dataTypes}
                onChange={(e) => setFilterCriteria(prev => ({ ...prev, dataTypes: e.target.value }))}
              >
                <option value="all">All Data Types</option>
                <option value="clinical">Clinical Data</option>
                <option value="claims">Claims Data</option>
                <option value="pharmacy">Pharmacy Data</option>
              </select>

              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterCriteria.exchangeFrameworks}
                onChange={(e) => setFilterCriteria(prev => ({ ...prev, exchangeFrameworks: e.target.value }))}
              >
                <option value="all">All Exchange Frameworks</option>
                <option value="carequality">Carequality</option>
                <option value="commonwell">CommonWell</option>
                <option value="directTrust">DirectTrust</option>
                <option value="udap">UDAP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payer Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trust Framework
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attestation Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exchange Frameworks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayers.map((payer) => (
                <tr key={payer.id} onClick={() => setSelectedPayer(payer)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payer.name}</div>
                        <div className="text-sm text-gray-500">EIN: {payer.ein}</div>
                        <div className="text-sm text-gray-500">{payer.organization.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${payer.attestation.trustFrameworkLevel === 'advanced'
                      ? 'bg-green-100 text-green-800'
                      : payer.attestation.trustFrameworkLevel === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      <Shield className="h-4 w-4 mr-1" />
                      {payer.attestation.trustFrameworkLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payer.attestation.status === 'attested'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {payer.attestation.status === 'attested' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 mr-1" />
                      )}
                      {payer.attestation.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Next: {new Date(payer.attestation.nextAttestation).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(payer.exchangeFrameworks)
                        .filter(([_, supported]) => supported)
                        .map(([framework]) => (
                          <span
                            key={framework}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {framework}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadCertificate(payer.id);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPayer && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Detailed Payer Information
              </h3>
              <button
                onClick={() => setSelectedPayer(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Organization Details</h4>
                  <div className="mt-2 grid grid-cols-1 gap-4">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={selectedPayer.organization.website} className="text-indigo-600 hover:text-indigo-900">
                        {selectedPayer.organization.website}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      {selectedPayer.organization.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      {selectedPayer.organization.email}
                    </div>
                  </div>
                </div>

                {/* Contacts */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Key Contacts</h4>
                  <div className="mt-2 space-y-4">
                    {['technicalContact', 'administrativeContact', 'privacyOfficer'].map((contactType) => (
                      <div key={contactType} className="border-t pt-4">
                        <h5 className="text-sm font-medium text-gray-700 capitalize">
                          {contactType.replace(/([A-Z])/g, ' $1')}
                        </h5>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div className="text-sm text-gray-500">
                            {selectedPayer.organization[contactType].name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedPayer.organization[contactType].email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                {renderMetricsSection(selectedPayer)}
              </div>

              {/* Technical Details */}
              <div className="space-y-6">
                {/* Security Frameworks */}
                {renderSecuritySection(selectedPayer)}

                {/* Exchange Frameworks */}
                {renderExchangeFrameworks(selectedPayer)}

                {/* Supported Versions */}
                {renderSupportedVersions(selectedPayer)}
              </div>

              {/* Full Width Sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* Endpoints */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">API Endpoints</h4>
                  <div className="mt-2">
                    <div className="border rounded-md divide-y">
                      {Object.entries(selectedPayer.endpoints).map(([key, value]) => (
                        <div key={key} className="px-4 py-3 flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-sm text-gray-500">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Supported Resources */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">FHIR Resources</h4>
                  <div className="mt-2">
                    <div className="border rounded-md divide-y">
                      {selectedPayer.attestation.supportedResources.map((resource, index) => (
                        <div key={index} className="px-4 py-3">
                          <h5 className="text-sm font-medium text-gray-900">{resource.type}</h5>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Operations:</span>{' '}
                              {resource.supportedOperations.join(', ')}
                            </div>
                            <div>
                              <span className="font-medium">Version:</span>{' '}
                              {resource.version}
                            </div>
                            {resource.searchParameters && (
                              <div className="col-span-2">
                                <span className="font-medium">Search Parameters:</span>{' '}
                                {resource.searchParameters.join(', ')}
                              </div>
                            )}
                            <div className="col-span-2">
                              <span className="font-medium">Profiles:</span>
                              <ul className="mt-1 list-disc pl-5">
                                {resource.profiles.map((profile, i) => (
                                  <li key={i}>{profile}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}