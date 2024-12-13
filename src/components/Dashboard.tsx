import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface StatBoxProps {
  title: string;
  icon: React.ReactNode;
  stats: {
  label: string;
  value: number;
  }[];
  lastUpdated: string;
}

const StatBox = ({ title, icon, stats, lastUpdated }: StatBoxProps) => (   
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-blue-500">{icon}</div>
    </div>
    <div className="flex justify-between mb-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-sm text-gray-500">{stat.label}</div>
          <div className="text-xl font-semibold mt-1">{stat.value}</div>
        </div>
      ))}
    </div>
    <div className="text-sm text-gray-500 flex items-center mt-2"> 
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      Last Updated: {lastUpdated}
    </div>
  </div>
);

interface ActivityItemProps {
  title: string;
  date: string;
  status?: string;
}

const ActivityItem = ({ title, date, status }: ActivityItemProps) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0">
    <span>{title}</span>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">{date}</span> 
      {status && (
        <span
          className={`text-sm ${
            status === 'Active' ? 'text-green-500' : 'text-yellow-500'
          }`}
        >
          {status}
        </span>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [isCertificateGenerationEnabled, setIsCertificateGenerationEnabled] = useState(false);
  const [certificateMessage, setCertificateMessage] = useState('');
  const [isCertificateGenerated, setIsCertificateGenerated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const email = localStorage.getItem('email');

    if (!user || !email) {
      navigate('/login');
      return;
    }
    // Check if the current date matches 13/12/2024
    const currentDate = new Date();
    const targetDate = new Date('2024-12-13'); 

    // Compare dates precisely
    const isSameDate =
      currentDate.getFullYear() === targetDate.getFullYear() &&    
      currentDate.getMonth() === targetDate.getMonth() &&
      currentDate.getDate() === targetDate.getDate();

    setIsCertificateGenerationEnabled(isSameDate);
  }, []);

  const handleGenerateCertificate = () => {
    // Calculate the validation date (1 year from the current date)
    const validationDate = new Date();
    validationDate.setFullYear(validationDate.getFullYear() + 1);

    const formattedDate = validationDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Set the message and mark certificate as generated
    setCertificateMessage(`Certificate is validated till ${formattedDate}`);
    setIsCertificateGenerated(true);
  };
  
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="p-4">
          {!isCertificateGenerated && (
            <button
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isCertificateGenerationEnabled
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-400 cursor-not-allowed' 
              }`}
              disabled={!isCertificateGenerationEnabled}
              onClick={handleGenerateCertificate}
            >
              Generate Certificate
            </button>
          )}

          {/* Display the message dynamically */}
          {certificateMessage && (
            <p className="mt-4 text-green-600 font-semibold text-center">
              {certificateMessage}
            </p>
          )}
        </div>
      </div>

      {/* Rest of the dashboard remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatBox
          title="Payer List"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="17" y1="11" x2="23" y2="11"></line>
            </svg>
          }
          stats={[
            { label: "Total", value: 9 }, 
            { label: "Active", value: 5 },
            { label: "Pending", value: 4 }, 
          ]}
          lastUpdated="12-12-2024"   
        />
        <StatBox
          title="Connected To"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          }
          stats={[
            { label: "Request", value: 8 },
            { label: "Response", value: 6 },
            { label: "Pending", value: 2 },
          ]}
          lastUpdated="12-12-2024"
        />
        <StatBox
          title="Connected From"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          }
          stats={[
            { label: "Request", value: 9 },
            { label: "Response", value: 6 },
            { label: "Pending", value: 3 },
          ]}
          lastUpdated="12-12-2024"
        />
      </div>

      {/* Rest of the component remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection List */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Connection List</h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
            </svg>
          </div>
          <div className="space-y-2">
            <ActivityItem
              title="Payer Name : Vinay-patil"
              date="12/12/24"
              status="Active"
            />
            <ActivityItem
              title="Payer Name : Sanchit-Ashtekar"
              date="12/12/24"
              status="Active"
            />
            <ActivityItem
              title="Payer Name : Sourabh-Gurav"
              date="12/12/24"
              status="Pending"
            />
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Activity List</h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="space-y-2">
            <ActivityItem
              title="Certificate Uploaded"
              date="12/12/24"
            />
            <ActivityItem
              title="Requested for Payer"
              date="12/12/24"
            />
            <ActivityItem
              title="Item 3"
              date="12/12/24"
            />
          </div>
        </div>
      </div>
    </div>
  );     
};

export default Dashboard;