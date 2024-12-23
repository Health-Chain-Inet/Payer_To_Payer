import config from '../config/config';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Activation: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchActivation = async () => {
            try {
                setIsLoading(true);
                const queryParams = new URLSearchParams(location.search);
                const burl = `${config.apiUrl}/verify/verify?key=${queryParams.get('key')}&actId=${queryParams.get('actId')}`;
                console.log('burl=', burl);
                const response = await fetch(burl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                if (data.message === 'Payers activated') {
                    setMessage('Payer Activated');
                } else {
                    setMessage('Payer is not activated');
                }
            } catch (error) {
                console.log('error=', error)
                setMessage('Unable to verify activation. Please try again or contact support.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivation();
    }, [location.search]);

    return (
        <div className="flex h-screen">
            {/* Left Section */}
            <div className="w-1/2 bg-[#004188] flex items-center justify-center">
                <h1 className="text-7xl font-bold text-white">Payer Activation</h1>
            </div>

            {/* Right Section */}
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    {isLoading ? (
                        <div className="text-gray-600 text-center">
                            <svg className="animate-spin h-5 w-5 mr-3 inline-block text-blue-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying activation...
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className={`text-lg font-semibold mb-4 ${message === 'Payer Activated' ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </div>
                            {message === 'Payer Activated' && (
                                <a
                                    href={`${config.Appurl}/login`}
                                    className="mt-4 inline-block px-6 py-2.5 bg-[#004188] text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-[#003166] hover:shadow-lg focus:bg-[#003166] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#002144] active:shadow-lg transition duration-150 ease-in-out"
                                >
                                    Click here to login
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activation;
