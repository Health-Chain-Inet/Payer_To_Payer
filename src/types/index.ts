// Adding User type for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  payerId: string;
  permissions: string[];
}

export interface Payer {
  id: string;
  name: string;
  ein: string;
  certificateStatus: 'active' | 'pending' | 'expired' | 'revoked';
  endpoints: {
    fhir: string;
    attestation: string;
    bulkData: string;
    patientAccess: string;
    providerDirectory: string;
    drugFormulary: string;
    priorAuth: string;
    attribution: string;
    membershipVerification: string;
  };
  attestation: {
    status: 'attested' | 'pending' | 'expired';
    lastAttested: string;
    nextAttestation: string;
    trustFrameworkLevel: 'basic' | 'intermediate' | 'advanced';
    supportedResources: FHIRResource[];
    privacyAndSecurityStandards: string[];
    implementationGuides: string[];
    supportedVersions: {
      fhir: string[];
      bulkDataIg: string[];
      udap: string[];
    };
    supportedProfiles: {
      uscdi: string[];
      pdex: string[];
      carin: string[];
    };
  };
  supportedVersion: string;
  lastUpdated: string;
  organization: {
    address: string;
    phone: string;
    email: string;
    website: string;
    technicalContact: {
      name: string;
      email: string;
      phone: string;
    };
    administrativeContact: {
      name: string;
      email: string;
      phone: string;
    };
    privacyOfficer: {
      name: string;
      email: string;
      phone: string;
    };
  };
  compliance: {
    hipaa: boolean;
    hitech: boolean;
    nist: boolean;
    hitrust: boolean;
    udap: boolean;
    fhirBulkData: boolean;
    smartOnFhir: boolean;
  };
  supportedOperations: {
    bulkDataExport: boolean;
    individualAccess: boolean;
    priorAuthorization: boolean;
    membershipVerification: boolean;
    attributionList: boolean;
    providerDirectory: boolean;
    drugFormulary: boolean;
  };
  dataSharing: {
    patientClinical: boolean;
    claims: boolean;
    pharmacy: boolean;
    providerDirectory: boolean;
    qualityMeasures: boolean;
    priorAuth: boolean;
    attribution: boolean;
  };
  exchangeFrameworks: {
    carequality: boolean;
    commonwell: boolean;
    directTrust: boolean;
    udap: boolean;
  };
  securityFrameworks: {
    oauth2: boolean;
    openIdConnect: boolean;
    smartOnFhir: boolean;
    udapSecurity: boolean;
    tieredOauth: boolean;
  };
  availabilityMetrics: {
    uptime: string;
    responseTime: number;
    lastDowntime: string;
    plannedMaintenance: {
      nextDate: string;
      duration: string;
    };
  };
  rateLimit: {
    requestsPerMinute: number;
    burstLimit: number;
    dailyLimit: number;
  };
}

export interface FHIRResource {
  type: string;
  supportedOperations: ('read' | 'search' | 'create' | 'update')[];
  version: string;
  profiles: string[];
  searchParameters?: string[];
  extensions?: string[];
  bulkDataSupport?: boolean;
  subscriptionSupport?: boolean;
}

export interface TrustFrameworkRequirement {
  level: 'basic' | 'intermediate' | 'advanced';
  requirements: {
    authentication: string[];
    encryption: string[];
    audit: string[];
    privacy: string[];
  };
  validationCriteria: string[];
  minimumStandards: {
    tls: string;
    fhir: string;
    oauth: string;
  };
}