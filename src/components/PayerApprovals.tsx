import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Search,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalContext.js';
//import { AdminModal } from './AdminModal.js';
import config from '../config/config.js';


interface Payer {
  cid: BigInteger;
  new_payer_id: string;
  old_payer_id: string;
  npname: string;
  opname: string;
  status: string;
  remarks: string;
  new_payer_side_validation: boolean;
  old_payer_side_validation: boolean;
  created_date: string; 
  updated_date: string;
  secret_key:string;
}

interface PayerApprovalsState {
  payers: Payer[];
  searchTerm: string;
  selectedPayer: Payer | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: PayerApprovalsState = {
  payers: [],
  searchTerm: '',
  selectedPayer: null,
  isLoading: true,
  error: null
};

export default function PayerApprovals() {
  const { globalVariable } = React.useContext(GlobalContext);
  const navigate = useNavigate();
  const [state, setState] = useState<PayerApprovalsState>(INITIAL_STATE);

  const [msg, setmsg] = React.useState('');

  // Memoized search filter
  const filteredPayers = useMemo(() => {
    const searchLower = state.searchTerm.toLowerCase();
    return state.payers.filter(p => {
      return (
        p.new_payer_id.toLowerCase().includes(searchLower) ||
        p.old_payer_id.toLowerCase().includes(searchLower) ||
        p.npname.toLowerCase().includes(searchLower) ||
        p.opname.toLowerCase().includes(searchLower) ||
        p.status.toLowerCase().includes(searchLower) ||
        p.remarks?.toLowerCase().includes(searchLower)
      );
    });
  }, [state.payers, state.searchTerm]);

  // Memoized fetch function
  const fetchPayers = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const payer_id = localStorage.getItem('payer_id')
      const response = await fetch( config.apiUrl + '/discovery/pendingapprovals?opid='+payer_id, {method:'GET'});

      console.log('response=', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('data=', data);
      console.log('datastatus=', data.status);
      console.log('datamsg=', data.data);
      if (data.status === 200) {
        setState(prev => ({
          ...prev,
          payers: data.data,
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          payers: [],
          isLoading: false
        }));
        //throw new Error('Invalid response status');
      }
    } catch (error) {
      console.log('err=', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payer data'
      }));
    }
  }, []);

  // Auth check and initial data fetch
  useEffect(() => {
    const user = localStorage.getItem('user');
    const email = localStorage.getItem('email');

    if (!user || !email) {
      navigate('/login');
      return;
    }

    fetchPayers();
  }, [navigate, fetchPayers]);


  const PayerApprovalsinit = async(npid:any) => {
    const opemail = localStorage.getItem('email')
  
    setmsg('Connecting to New payer. Please wait..')
    setTimeout(()=>{ setmsg('Validating Certificates. Please wait..') }, 2500)
    const connectapiurl = config.apiUrl + '/discovery/oconnectpayer?oe='+opemail+'&npid='+npid;
    console.log('payer connection started with = ', npid)
    console.log('url=', connectapiurl);
    await fetch(connectapiurl,{method: 'GET'})
    .then(response => response.json()).then(async(data)=>{
        console.log('data=', data);
        setmsg('Refreshing data')
        await fetchPayers();
        setmsg('Connected with New payer. Sent a reminder email to ')
        setTimeout(() => { setmsg('') }, 5000);
    })
    .catch(error => console.log('Error:', error));
  }

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
              Payer Approvals
            </h3>
          </div>

          <div className="mt-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
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
            {msg}
          </div>  
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Payer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Old Payer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks & Status 
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayers.length > 0 ? (
                  filteredPayers.map((payer) => (
                    <tr key={payer.cid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payer.npname}</div>
                          <div className="text-sm text-gray-500"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {payer.opname}
                    
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {payer.remarks} <br />
                          {payer.status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => 
                             PayerApprovalsinit(payer.new_payer_id)
                          }
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                        Approve                        
                        </button>
                        
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No Approvals found <br />
                   
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

  
    </div>
  );
}