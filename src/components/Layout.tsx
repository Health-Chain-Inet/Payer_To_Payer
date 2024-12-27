import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Link as LinkIcon,
  LogOut,
  CheckSquare,
  Upload,
  Settings,
  FileText,
  Network,
  Lock,
  Home,
  Check
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

import Logo from "../../dist/assets/hclogo.png"
import Dashboard from './Dashboard';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate(); //Initialize the navigate function

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Payer-Endpoints', href: '/payerendpoints', icon: Check },
    { name: 'Create Client Certificate', href: '/createclient', icon: Upload },
    { name: 'Publish Server Certificate', href: '/publishserver', icon: Upload },
    { name: 'Payer Directory', href: '/directory', icon: Users },
    { name: 'Certificate Management', href: '/certificates', icon: Shield },
  ];
  /*
      { name: 'Certificate Validation', href: '/validate', icon: CheckSquare },
    { name: 'Active Connections', href: '/connections', icon: Network },
    { name: 'Trust Framework', href: '/trust-framework', icon: Lock },
    { name: 'Attestation', href: '/attestation', icon: FileText },
    { name: 'Bulk Data Exchange', href: '/bulk-data', icon: Upload },
    { name: 'Settings', href: '/settings', icon: Settings },
         { name: 'Payer Connect', href: '/payerconnect', icon: Network },
    { name: 'Payer Approvals', href: '/payerapprovals', icon: Check },
  */ 

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-left">
                {/* <Shield className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">P2P Connect</span> */}
                <img className='w-full h-full rounded-full' src={Logo} alt="Health-chain logo" />
                {/* <span className="ml-2 text-xl font-bold text-gray-900">P2P Connect</span> */}

              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-500 mr-4">
                  <i className="fa-solid fa-user"></i>{localStorage.getItem('user')} 
                </span>


                <button
                  onClick={handleLogout} // Use the handleLogout function
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button> <br />
                <span className="text-sm text-gray-500 mr-4">
                  {localStorage.getItem('email')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-60 bg-blue-100  font-bold  h-[calc(100vh-4rem)] border-r border-gray-200 ">
          <nav className="mt-5 px-2  ">
            <div className="space-y-2 ">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      relative group flex items-center px-3 py-2 text-sm font-medium 
                      transition-all duration-300 ease-in-out
                      ${isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                       <Icon
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6 
                        transition-colors duration-300 ease-in-out
                        ${isActive 
                          ? 'text-white' 
                          : 'text-gray-400 group-hover:text-indigo-500'
                        }
                      `}
                    />
                    {item.name} <br />
                    <hr className="border-t border-gray-300 my-4 mx-0" />

                  
                  </Link>
                  
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto  bg-gray-100">
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}