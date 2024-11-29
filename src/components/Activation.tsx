import config from '../config/config'
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
        <div className="p-4">
            {isLoading ? (
                <div className="text-gray-600">Verifying activation...</div>
            ) : (
                <div>
                    <span className="mr-2">{message}</span>
                    {message === 'Payer Activated' && (
                        <a
                            href={`${config.Appurl}/login`}
                            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-2"
                        >
                            Click here to login
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default Activation;
