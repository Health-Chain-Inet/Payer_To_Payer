import React from 'react';
import { Shield, CheckCircle, AlertTriangle, Settings, Lock } from 'lucide-react';
import type { TrustFrameworkRequirement } from '../types';

const trustLevels: TrustFrameworkRequirement[] = [
  {
    level: 'basic',
    requirements: {
      authentication: [
        'OAuth 2.0',
        'OpenID Connect',
        'JWT Token Support'
      ],
      encryption: [
        'TLS 1.2+',
        'AES-256 Encryption',
        'RSA 2048-bit Keys'
      ],
      audit: [
        'Basic Access Logging',
        'Error Tracking',
        'User Authentication Logs'
      ],
      privacy: [
        'Basic Patient Consent',
        'Data Minimization',
        'Access Controls'
      ]
    },
    validationCriteria: [
      'Valid SSL Certificate',
      'FHIR R4 Compliance',
      'Basic Authentication Flow'
    ],
    minimumStandards: {
      tls: 'TLS 1.2',
      fhir: 'R4',
      oauth: '2.0'
    }
  },
  {
    level: 'intermediate',
    requirements: {
      authentication: [
        'SMART on FHIR',
        'Multi-factor Authentication',
        'Token Introspection'
      ],
      encryption: [
        'TLS 1.3',
        'Perfect Forward Secrecy',
        'Hardware Security Module Support'
      ],
      audit: [
        'Detailed Access Logs',
        'Security Event Monitoring',
        'Automated Alerts'
      ],
      privacy: [
        'Granular Consent Management',
        'Data Segmentation',
        'Purpose of Use Tracking'
      ]
    },
    validationCriteria: [
      'HITRUST Certification',
      'SOC 2 Type II',
      'Advanced API Security'
    ],
    minimumStandards: {
      tls: 'TLS 1.3',
      fhir: 'R4',
      oauth: '2.1'
    }
  },
  {
    level: 'advanced',
    requirements: {
      authentication: [
        'Zero Trust Architecture',
        'Biometric Authentication Support',
        'Advanced Token Management'
      ],
      encryption: [
        'Post-Quantum Cryptography Ready',
        'End-to-End Encryption',
        'Custom Security Controls'
      ],
      audit: [
        'AI-powered Threat Detection',
        'Real-time Security Analytics',
        'Compliance Automation'
      ],
      privacy: [
        'Dynamic Consent Management',
        'Privacy-Preserving Analytics',
        'Advanced Data Rights Management'
      ]
    },
    validationCriteria: [
      'EHNAC Certification',
      'NIST CSF High',
      'Zero Trust Verification'
    ],
    minimumStandards: {
      tls: 'TLS 1.3',
      fhir: 'R4',
      oauth: '2.1'
    }
  }
];

export default function TrustFramework() {
  const [selectedLevel, setSelectedLevel] = React.useState<string>('intermediate');
  const [isConfiguring, setIsConfiguring] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Trust Framework Configuration</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure and manage trust framework requirements for payer-to-payer exchange
            </p>
          </div>
          <button
            onClick={() => setIsConfiguring(!isConfiguring)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure Framework
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {trustLevels.map((framework) => (
            <div
              key={framework.level}
              className={`border rounded-lg p-6 ${
                selectedLevel === framework.level
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium capitalize">{framework.level}</h3>
                <Shield className={`h-6 w-6 ${
                  framework.level === 'advanced' 
                    ? 'text-indigo-600' 
                    : framework.level === 'intermediate'
                    ? 'text-yellow-500'
                    : 'text-gray-400'
                }`} />
              </div>

              <div className="space-y-4">
                {Object.entries(framework.requirements).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-900 capitalize mb-2">
                      {category}
                    </h4>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Minimum Standards
                  </h4>
                  <div className="bg-gray-50 rounded-md p-3">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="text-gray-500">TLS Version:</dt>
                      <dd className="text-gray-900">{framework.minimumStandards.tls}</dd>
                      <dt className="text-gray-500">FHIR Version:</dt>
                      <dd className="text-gray-900">{framework.minimumStandards.fhir}</dd>
                      <dt className="text-gray-500">OAuth Version:</dt>
                      <dd className="text-gray-900">{framework.minimumStandards.oauth}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedLevel(framework.level)}
                  className={`w-full inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                    selectedLevel === framework.level
                      ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {selectedLevel === framework.level ? 'Selected' : 'Select Level'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Compliance Status */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Compliance Status
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Security Controls
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Multi-Factor Authentication</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Encryption at Rest</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Advanced Threat Protection</span>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Certifications & Audits
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-sm text-gray-600">HITRUST Certification</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SOC 2 Type II</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-gray-600">EHNAC Accreditation</span>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}