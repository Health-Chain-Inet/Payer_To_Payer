import type { Payer } from '../types';

export const mockPayers: Payer[] = [
  {
    id: '1',
    name: 'Blue Cross Blue Shield',
    ein: '12-3456789',
    certificateStatus: 'active',
    endpoints: {
      fhir: 'https://api.bcbs.com/fhir/r4',
      attestation: 'https://api.bcbs.com/attestation',
      bulkData: 'https://api.bcbs.com/bulk-data',
      patientAccess: 'https://api.bcbs.com/patient-access',
      providerDirectory: 'https://api.bcbs.com/provider-directory',
      drugFormulary: 'https://api.bcbs.com/drug-formulary',
      priorAuth: 'https://api.bcbs.com/prior-auth',
      attribution: 'https://api.bcbs.com/attribution',
      membershipVerification: 'https://api.bcbs.com/membership'
    },
    attestation: {
      status: 'attested',
      lastAttested: '2024-02-15T00:00:00Z',
      nextAttestation: '2024-08-15T00:00:00Z',
      trustFrameworkLevel: 'advanced',
      supportedResources: [
        {
          type: 'Patient',
          supportedOperations: ['read', 'search'],
          version: 'R4',
          profiles: ['us-core-patient'],
          searchParameters: ['identifier', 'name', 'birthdate']
        }
      ],
      privacyAndSecurityStandards: ['HIPAA', 'HITECH'],
      implementationGuides: ['US Core', 'CARIN BB'],
      supportedVersions: {
        fhir: ['R4'],
        bulkDataIg: ['1.0.0'],
        udap: ['1.0']
      },
      supportedProfiles: {
        uscdi: ['v1', 'v2'],
        pdex: ['2.0.0'],
        carin: ['1.0.0']
      }
    },
    supportedVersion: 'R4',
    lastUpdated: '2024-03-15T00:00:00Z',
    organization: {
      address: '123 Healthcare Ave, Suite 100, Chicago, IL 60601',
      phone: '(312) 555-0123',
      email: 'interop@bcbs.com',
      website: 'https://www.bcbs.com',
      technicalContact: {
        name: 'John Smith',
        email: 'john.smith@bcbs.com',
        phone: '(312) 555-0124'
      },
      administrativeContact: {
        name: 'Jane Doe',
        email: 'jane.doe@bcbs.com',
        phone: '(312) 555-0125'
      },
      privacyOfficer: {
        name: 'Robert Johnson',
        email: 'robert.johnson@bcbs.com',
        phone: '(312) 555-0126'
      }
    },
    compliance: {
      hipaa: true,
      hitech: true,
      nist: true,
      hitrust: true,
      udap: true,
      fhirBulkData: true,
      smartOnFhir: true
    },
    supportedOperations: {
      bulkDataExport: true,
      individualAccess: true,
      priorAuthorization: true,
      membershipVerification: true,
      attributionList: true,
      providerDirectory: true,
      drugFormulary: true
    },
    dataSharing: {
      patientClinical: true,
      claims: true,
      pharmacy: true,
      providerDirectory: true,
      qualityMeasures: true,
      priorAuth: true,
      attribution: true
    },
    exchangeFrameworks: {
      carequality: true,
      commonwell: true,
      directTrust: true,
      udap: true
    },
    securityFrameworks: {
      oauth2: true,
      openIdConnect: true,
      smartOnFhir: true,
      udapSecurity: true,
      tieredOauth: true
    },
    availabilityMetrics: {
      uptime: '99.9%',
      responseTime: 150,
      lastDowntime: '2024-01-15T00:00:00Z',
      plannedMaintenance: {
        nextDate: '2024-04-15T00:00:00Z',
        duration: '2 hours'
      }
    },
    rateLimit: {
      requestsPerMinute: 1000,
      burstLimit: 2000,
      dailyLimit: 1000000
    }
  }
];