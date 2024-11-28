import React from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ValidationResult {
  valid: boolean;
  details: {
    subject: {
      organization: string;
      commonName: string;
      organizationalUnit: string;
    };
    issuer: {
      organization: string;
      commonName: string;
    };
    validity: {
      notBefore: string;
      notAfter: string;
      isExpired: boolean;
      daysUntilExpiration: number;
    };
    keyUsage: string[];
    signatureAlgorithm: string;
    trustChainValid: boolean;
    ocspStatus: 'good' | 'revoked' | 'unknown';
    caVerification: {
      valid: boolean;
      caName: string;
      verifiedChain: boolean;
      lastVerified: string;
    };
  };
  endpoints: {
    url: string;
    status: 'valid' | 'invalid';
    lastChecked: string;
    responseTime: number;
  }[];
}

export default function CertificateValidator() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [validating, setValidating] = React.useState(false);
  const [result, setResult] = React.useState<ValidationResult | null>(null);

  const validateCertificate = async (data: any) => {
    setValidating(true);
    
    // Create FormData with certificate and endpoint
    const formData = new FormData();
    formData.append('certificate', data.certificate[0]);
    formData.append('endpoint', data.endpoint);
    
    try {
      // Simulate API call - replace with actual validation endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation result
      setResult({
        valid: true,
        details: {
          subject: {
            organization: "Blue Cross Blue Shield",
            commonName: "api.bcbs.com",
            organizationalUnit: "Health Information Exchange"
          },
          issuer: {
            organization: "DigiCert Inc",
            commonName: "DigiCert TLS RSA SHA256 2020 CA1"
          },
          validity: {
            notBefore: "2024-01-01T00:00:00Z",
            notAfter: "2025-01-01T23:59:59Z",
            isExpired: false,
            daysUntilExpiration: 292
          },
          keyUsage: ["Digital Signature", "Key Encipherment"],
          signatureAlgorithm: "SHA256withRSA",
          trustChainValid: true,
          ocspStatus: "good",
          caVerification: {
            valid: true,
            caName: "DigiCert Trusted Root CA",
            verifiedChain: true,
            lastVerified: new Date().toISOString()
          }
        },
        endpoints: [
          {
            url: "https://api.bcbs.com/fhir/r4",
            status: "valid",
            lastChecked: new Date().toISOString(),
            responseTime: 123
          },
          {
            url: "https://api.bcbs.com/attestation",
            status: "valid",
            lastChecked: new Date().toISOString(),
            responseTime: 98
          }
        ]
      });
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Certificate Validation
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Upload a certificate and endpoint URL to validate against trusted Certificate Authorities.</p>
        </div>
        
        <form onSubmit={handleSubmit(validateCertificate)} className="mt-5">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Certificate File (PEM format)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a certificate</span>
                      <input
                        {...register('certificate', { required: true })}
                        type="file"
                        className="sr-only"
                        accept=".pem,.crt,.cer"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PEM, CRT, or CER up to 5MB</p>
                </div>
              </div>
              {errors.certificate && (
                <p className="mt-2 text-sm text-red-600">Certificate is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payer Endpoint URL
              </label>
              <input
                type="url"
                {...register('endpoint', { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://api.example.com"
              />
              {errors.endpoint && (
                <p className="mt-2 text-sm text-red-600">Endpoint URL is required</p>
              )}
            </div>

            <button
              type="submit"
              disabled={validating}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {validating ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="-ml-1 mr-2 h-5 w-5" />
                  Validate Certificate
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Validation Results</h4>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Overall Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  result.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.valid ? (
                    <CheckCircle className="mr-1 h-4 w-4" />
                  ) : (
                    <XCircle className="mr-1 h-4 w-4" />
                  )}
                  {result.valid ? 'Valid' : 'Invalid'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-3">Certificate Authority Verification</h5>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">CA Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{result.details.caVerification.caName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Trust Chain</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.details.caVerification.verifiedChain ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.details.caVerification.verifiedChain ? 'Verified' : 'Invalid'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-3">Certificate Details</h5>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Organization</dt>
                    <dd className="mt-1 text-sm text-gray-900">{result.details.subject.organization}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Common Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{result.details.subject.commonName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(result.details.validity.notAfter).toLocaleDateString()}
                      {!result.details.validity.isExpired && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({result.details.validity.daysUntilExpiration} days remaining)
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">OCSP Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.details.ocspStatus === 'good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.details.ocspStatus.toUpperCase()}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-3">Endpoint Verification</h5>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {result.endpoints.map((endpoint, index) => (
                      <li key={index}>
                        <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {endpoint.status === 'valid' ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{endpoint.url}</p>
                              <p className="text-sm text-gray-500">
                                Response time: {endpoint.responseTime}ms
                              </p>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              endpoint.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {endpoint.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}