// SECTION 1: Imports
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
import { useNavigate } from 'react-router-dom';
import { mockPayers } from '../data/mockPayers.js';

interface Payer {
  id: string;
  payer_name: string;
  payer_email: string;
  payer_address: string;
  certificate_uploaded: boolean;
  certificate_verified: boolean;
  phone?: string;
  website?: string;
}

interface PayerDirectoryState {
  payers: Payer[];
  searchTerm: string;
  showAdminModal: boolean;
  selectedPayer: Payer | null;
  show: number;
  isLoading: boolean;
  error: string | null;
}


export default function PayerDirectory() {
  const { globalVariable } = React.useContext(GlobalContext);
  const navigate = useNavigate();
  // interface Payer {
  //   activate_key:string,
  //   active:string,
  //   adm_email:string,
  //   adm_id:string,
  //   adm_name: string,
  //   adm_password:string,
  //   adm_phone:string,
  //   certificate_uploaded:string,
  //   certificate_verified:string,
  //   created_date:string,
  //   org_ein:string,
  //   org_privacy_policy:string,
  //   org_terms:string,
  //   org_website:string,
  //   payer_addr1:string,
  //   payer_addr2:string,
  //   payer_base_url:string,
  //   payer_city:string,
  //   payer_country:string,
  //   payer_id:string,
  //   payer_name:string,
  //   payer_state:string,
  //   payer_type:string,
  //   payer_zip:string,
  //   updated_date:null
  // }
  const [payor, setPayor] = useState([]);

  const [test, settest] = useState<any>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState(null);
  const [show, setShow] = useState(1);



  const [state, setState] = useState<PayerDirectoryState>({
    payers: [],
    searchTerm: '',
    showAdminModal: false,
    selectedPayer: null,
    show: 1,
    isLoading: true,
    error: null
  });



  // const [payers, setPayers] = React.useState<Payer[]>(mockPayers);



  // 1. Memoize filtered results
  // const filteredPayers = React.useMemo(() => {
  //   return payers.filter(payer => {
  //     const matchesSearch =
  //       payer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       payer.ein.includes(searchTerm) ||
  //       payer.organization.email.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesTrustLevel =
  //       filterCriteria.trustLevel === 'all' ||
  //       payer.attestation.trustFrameworkLevel === filterCriteria.trustLevel;

  //     const matchesAttestationStatus =
  //       filterCriteria.attestationStatus === 'all' ||
  //       payer.attestation.status === filterCriteria.attestationStatus;

  //     return matchesSearch && matchesTrustLevel && matchesAttestationStatus;
  //   });
  // }, [payers, searchTerm, filterCriteria]);








  const fetchPayers = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('http://localhost:3001/directory/fetchAllPayers');
      if (!response.ok) {
        throw new Error('Failed to fetch payer data');
      }
      const data = await response.json();
      console.log('data=', data.message)
      if (data.status === 200) {
        // Update the payer state with the fetched data
        const msg = data.message; 
       setPayor([...msg]);
       payor.map((item)=> {
        console.log('payor=', item)

       })
      }
    } catch (error) {
      console.error('Error fetching payer data:', error);
      // Handle error state update if necessary
    }
  };


  // SECTION 3: Modal Component
  const AdminModal = ({ payer, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Administration Details
          </h3>
          <button onClick={onClose}>
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <h4>Payer Name</h4>
            <p>{payer.payerName}</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>{payer.payerEmail}</p>
          </div>
          <div>
            <h4>Address</h4>
            <p>{payer.payerAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );




  // const renderSupportedVersions = React.useCallback((payer: Payer) => (
  //   <div className="space-y-4">
  //     <h4 className="text-sm font-medium text-gray-900">Supported Versions</h4>
  //     <div className="grid grid-cols-1 gap-4">
  //       {Object.entries(payer.attestation.supportedVersions).map(([category, versions]) => (
  //         <div key={category} className="space-y-2">
  //           <h5 className="text-sm font-medium text-gray-700 capitalize">{category}</h5>
  //           <div className="flex flex-wrap gap-2">
  //             {versions.map((version, index) => (
  //               <span
  //                 key={index}
  //                 className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
  //               >
  //                 {version}
  //               </span>
  //             ))}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // ), []);




  useEffect(() => {
    const user = localStorage.getItem('user');
    const email = localStorage.getItem('email');

    if (!user || !email) {
      setState(prev => ({ ...prev, show: 0 }));
      navigate('/login');
    } else {
      fetchPayers();
      console.log("fetch payers done")
      // let bb = ['a','b']
      // settest([...test, ...bb])
    }
  }, [navigate]);



  // useEffect(() => {
  //   const fetchPayerData = async () => {

  //     try {
  //       const response = await fetch('http://localhost:3001/directory/fetchAllPayers');
  //       const data = await response.json();
  //       console.log("data = ",data)
  //       setPayer(prev => ({ ...prev, data }));

  //     } catch (error) {
  //       console.log('Error fetching payer data:', error);
  //     }
  //   };
    

  //   fetchPayerData();
  // }, []);


  // const renderPayerRows = () => {
  //   if (state.isLoading) {
  //     return (
  //       <tr>
  //         <td colSpan={5} className="px-6 py-4 text-center">
  //           <div className="flex justify-center items-center space-x-2">
  //             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
  //             <span>Loading payers...</span>
  //           </div>
  //         </td>
  //       </tr>
  //     );
  //   }

  //   if (state.error) {
  //     return (
  //       <tr>
  //         <td colSpan={5} className="px-6 py-4 text-center text-red-600">
  //           {state.error}
  //         </td>
  //       </tr>
  //     );
  //   }

  //   // if (filteredPayers.length === 0) {
  //   //   return (
  //   //     <tr>
  //   //       <td colSpan={5} className="px-6 py-4 text-center">
  //   //         No payers found matching your search criteria.
  //   //       </td>
  //   //     </tr>
  //   //   );
  //   // }

  //   // return filteredPayers.map((payer) => (
  //   //   <tr key={payer.id} className="hover:bg-gray-50">
  //   //     <td className="px-6 py-4">
  //   //       <div className="flex items-center">
  //   //         <div>
  //   //           <div className="text-sm font-medium text-gray-900">{payer.payer_name}</div>
  //   //           <div className="text-sm text-gray-500">{payer.payer_email}</div>
  //   //         </div>
  //   //       </div>
  //   //     </td>
  //   //     <td className="px-6 py-4">
  //   //       <div className="text-sm text-gray-900">{payer.payer_address}</div>
  //   //     </td>
  //   //     <td className="px-6 py-4">
  //   //       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payer.certificate_uploaded
  //   //         ? 'bg-green-100 text-green-800'
  //   //         : 'bg-red-100 text-red-800'
  //   //         }`}>
  //   //         {payer.certificate_uploaded ? 'Yes' : 'No'}
  //   //       </span>
  //   //     </td>
  //   //     <td className="px-6 py-4">
  //   //       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payer.certificate_verified
  //   //         ? 'bg-green-100 text-green-800'
  //   //         : 'bg-yellow-100 text-yellow-800'
  //   //         }`}>
  //   //         {payer.certificate_verified ? 'Verified' : 'Pending'}
  //   //       </span>
  //   //     </td>
  //   //     <td className="px-6 py-4">
  //   //       <button
  //   //         onClick={() => setState(prev => ({
  //   //           ...prev,
  //   //           selectedPayer: payer,
  //   //           showAdminModal: true
  //   //         }))}
  //   //         className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
  //   //       >
  //   //         More Info
  //   //       </button>
  //   //     </td>
  //   //   </tr>
  //   // ));
  // };

  if (state.show === 0) return null;


  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payer Directory
              {/* {payor.map( (item) => (
                <pre>{item.payer_id}</pre>
              ))} */}
            </h3>
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

          </div>
        </div>
 

        {/* ******************** Payers Table **************** */}
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payer Name
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payer Address
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate Uploaded
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate Verified
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  More Info
                </th>
              </tr>
            </thead>


            {/* Payer rows */}
            <tbody className="bg-white divide-y divide-gray-200">
              
              {payor.map((p) => (
                <tr key={p.id} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{p.payer_name}</div>
                        <div className="text-sm text-gray-500">{p.adm_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{p.payer_addr1}<br/>{p.payer_addr2} </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.certificate_uploaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.certificate_uploaded ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.certificate_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {p.certificate_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedPayer(p);
                        setShowAdminModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      More Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>





          </table>
        </div>
        {/* ******************** Payers Table **************** */}
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