import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Search,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalContext';
import { AdminModal } from './AdminModal';

interface Payer {
  payer_id: string;
  payer_name: string;
  adm_name: string;
  adm_email: string;
  adm_phone: string;
  payer_addr1: string;
  payer_addr2: string;
  certificate_uploaded: boolean;
  certificate_verified: boolean;
  
}

interface PayerDirectoryState {
  payers: Payer[];
  searchTerm: string;
  showAdminModal: boolean;
  selectedPayer: Payer | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;  // New: Track current page
  pageSize: number;     // New: Items per page
}

const INITIAL_STATE: PayerDirectoryState = {
  payers: [],
  searchTerm: '',
  showAdminModal: false,
  selectedPayer: null,
  isLoading: true,
  error: null, 
  currentPage: 1,    // Start at first page
  pageSize: 10       // Show 10 items per page
};

export default function PayerDirectory() {
  const { globalVariable } = React.useContext(GlobalContext);
  const navigate = useNavigate();
  const [state, setState] = useState<PayerDirectoryState>(INITIAL_STATE);

  


  // Memoized search filter
  const filteredPayers = useMemo(() => {
    const searchLower = state.searchTerm.toLowerCase();
    return state.payers.filter(p => {

      return (
        p.payer_name.toLowerCase().includes(searchLower) ||
        p.adm_email.toLowerCase().includes(searchLower) ||
        p.payer_addr1.toLowerCase().includes(searchLower) ||
        p.payer_addr2?.toLowerCase().includes(searchLower)
      );
    });
  }, [state.payers, state.searchTerm]);


  
    // New : Calculate paginated data
    const paginatedPayers = useMemo(() => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      return filteredPayers.slice(startIndex, endIndex);
    }, [filteredPayers, state.currentPage, state.pageSize]);
  
    // New: Calculate total pages
    const totalPages = useMemo(() =>
      Math.ceil(filteredPayers.length / state.pageSize),
      [filteredPayers.length, state.pageSize]
    );
  

  // Memoized fetch function
  const fetchPayers = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('http://localhost:3001/directory/fetchAllPayers', {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200) {
        setState(prev => ({
          ...prev,
          payers: data.message,
          isLoading: false
        }));
      } else {
        throw new Error('Invalid response status');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payer data'
      }));
    }
  }, []);


     // New: Handle page change
  const handlePageChange = (newPage: number) => {
    setState(prev => ({ ...prev, currentPage: newPage }));
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const email = localStorage.getItem('email');

    if (!user || !email) {
      navigate('/login');
      return;
    }

    fetchPayers();
  }, [navigate, fetchPayers]);
  



  // Loading state
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading payer directory
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {state.error}
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={fetchPayers}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        {/* Search Header */}
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payer Directory
            </h3>
          </div>

          <div className="mt-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input  
                type="text"
                className="block w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
                placeholder="Search by payer name, email, or address..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Payers Table */}
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-500 uppercase tracking-wider">
                    Payer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-500 uppercase tracking-wider">
                    Payer Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-500 uppercase tracking-wider">
                    Certificate Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayers.length > 0 ? (
                  filteredPayers.map((payer) => (
                    <tr key={payer.payer_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payer.payer_name}</div>
                          <div className="text-sm text-gray-500">{payer.adm_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {payer.payer_addr1}
                          {payer.payer_addr2 && <br />}
                          {payer.payer_addr2}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payer.certificate_uploaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {payer.certificate_uploaded ? 'Uploaded' : 'Not Uploaded'}
                          </span>
                          {payer.certificate_uploaded && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payer.certificate_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {payer.certificates_verified_count == 2 ? 'Verified' : 'Not Verified'} 
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setState(prev => ({
                            ...prev,
                            selectedPayer: payer,
                            showAdminModal: true
                          }))}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          More Info
                        </button>
                        
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No results found for "{state.searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
{/* New : Pagination Controls */}
{filteredPayers.length > 0 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={state.currentPage === 1}
                className={`
        px-4 py-2 rounded-md text-sm font-medium
        ${state.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}
      `}
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {[...Array(totalPages)].map((_, index) => {
                  if (
                    index < 3 ||
                    index === state.currentPage - 1 ||
                    index > totalPages - 4
                  ) {
                    return (
                      <button
                        key={index + 1}
                        onClick={() => setState(prev => ({ ...prev, currentPage: index + 1 }))}
                        className={`
                w-10 h-10 rounded-md text-sm font-medium transition-colors duration-200
                ${state.currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}
              `}
                      >
                        {index + 1}
                      </button>
                    );
                  } else if (index === 3 || index === totalPages - 4) {
                    return <span key={index}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={state.currentPage === totalPages}
                className={`
        px-4 py-2 rounded-md text-sm font-medium
        ${state.currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}
      `}
              >
                Next
              </button>
            </div>
                 )}
          {/* New : Pagination Controls */}
                 
        </div>


      </div>

      

      <AdminModal
        isOpen={state.showAdminModal}
        onClose={() => setState(prev => ({ ...prev, showAdminModal: false, selectedPayer: null }))}
        payer={state.selectedPayer}
      />
    </div>
  );
}