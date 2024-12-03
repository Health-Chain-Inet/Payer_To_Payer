import config from '../config/config';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Logo from '../../dist/assets/hclogo.png';

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
                <h1 className="text-7xl font-bold text-white text-center">
                    Payer to Payer
                </h1>
            </div>

            {/* Right Section */}
            <div className="w-1/2 flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md shadow-[0_8px_50px_rgb(0,0,0,0.12)]">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center mb-6">
                            <div className="w-40 h-20 mx-auto mb-4">
                                <img src={Logo} alt="Health Chain" className="w-full h-full" />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center">
                                <div className="loader mb-4"></div> {/* Add spinner */}
                                <p className="text-gray-600">Verifying activation...</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p
                                    className={`text-lg font-medium mb-4 ${
                                        message === 'Payer Activated' ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {message}
                                </p>
                                {message === 'Payer Activated' && (
                                    <a
                                        href={`${config.Appurl}/login`}
                                        className="inline-block px-6 py-2.5 bg-[#004188] text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-[#003166] hover:shadow-lg focus:bg-[#003166] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#002244] active:shadow-lg transition duration-150 ease-in-out"
                                    >
                                        Click here to login
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activation;
