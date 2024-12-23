import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import config from "../config/config.js";

interface CreateClientCertificateProps {
    privateKey: string;
    csr: string;
}

interface Certificate {
    type: string;
    validFrom: string;
    validUntil: string;
}

interface PayerDetails {

    payer_name: string; // Corresponds to "payer_name"

    adm_name: string; // Corresponds to "adm_name"

    cert_type: string;

    certificate_uploaded: boolean; // Corresponds to "certificate_uploaded"
    certificate_verified: boolean; // Corresponds to "certificate_verified"

    adm_email: string | null; // Corresponds to "email"

    validity_notafter: string | null; // Corresponds to "validity_notafter"
    validity_notbefore: string | null; // Corresponds to "validity_notbefore"
}

const PublishServerCertificate: React.FC<CreateClientCertificateProps> = ({ privateKey, csr }) => {
    const [certmsg, setcertmsg] = React.useState('');
    const [payerDetails, setPayerDetails] = React.useState<PayerDetails | null>([]);
    const [isDisabled, setIsDisabled] = React.useState(false);
    // const [certificates, setCertificates] = useState<Certificate[]>([
    //     {
    //         type: 'Server Certificate',
    //         validFrom: '2024-01-01',
    //         validUntil: '2025-01-01'
    //     }
    // ]);
    const [privateKeyState, setPrivateKeyState] = useState(privateKey);
    const [csrState, setCsrState] = useState(csr);

    const fetchPayerDetails = async () => {
        const email = localStorage.getItem('email');
        console.log('Fetching payer details for email:', email);
        if (!email) return;

        setcertmsg('Loading...');
        try {
            const response = await fetch(`http://localhost:3001/directory/fetchcertificatedetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            console.log('response', data);
            setcertmsg('');
            if (data.message.length > 0) {
                let res = data.message;
                res = res.filter(p => p.cert_type === 'server');
                console.log('res=', res);
                if(res.length > 0) {
                    setIsDisabled(true);
                }
                setPayerDetails(res);
               
            }
            console.log(payerDetails);
        } catch (error) {
            console.error('Error fetching payer details:', error);
        }
    };

    const handleDownloadCA = () => {
        // const url = 'http://localhost:3001/directory/downloadintermediate';
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = 'CA_Intermediate_Certificate.txt';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    };

    const handleGenerateCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        setcertmsg('Generating Please Wait.. ');
        if(!privateKeyState || !csrState){
            setcertmsg('Either private key or csr is blank');
            setTimeout(()=>{ setcertmsg('') }, 2000);
            return;
        }
        const postdata = {
            'private_key': privateKeyState,
            'csr': csrState,
            'payer_id': localStorage.getItem('payer_id'),
            'email': localStorage.getItem('email')
        };

        console.log(postdata);

        try {
            setcertmsg('Server Certificate Generating.. ');
            const response = await fetch(config.apiUrl + `/directory/serverCertificate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postdata)
            });
            console.log('res=', response);
            const data = await response.json();
            if (data.status == 200) {
                setcertmsg('getting data..');
                await fetchPayerDetails();
                setcertmsg('Generated Server Certificate');
            } else {
                setcertmsg('Error: Certificate Not generated');
            }
            console.log('response', data);
        } catch (err: any) {
            setcertmsg(err.message);
            console.log(err);
        }
    };

    const handleDownloadCertificate = () => {
        // Implement certificate download logic
    };

    useEffect(() => {
        fetchPayerDetails();
    }, []);

    const formatDate = (date: string | null) => {
        if (!date) return 'No Data';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Publish Server Certificate</h2>
                <button
                    onClick={handleDownloadCA}
                    className="px-6 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#252082] transition-colors duration-200"
                >
                    Download CA Intermediate Certificate
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Private Key</h3>
                    <textarea
                        placeholder="Private Key"
                        value={privateKeyState}
                        onChange={(e) => setPrivateKeyState(e.target.value)}
                        className="w-full h-64 p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Certificate Signing Request (CSR)</h3>
                    <textarea
                        placeholder="Certificate Signing Request"
                        value={csrState}
                        onChange={(e) => setCsrState(e.target.value)}
                        className="w-full h-64 p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleGenerateCertificate}
                    className={`h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 ${isDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-700 hover:bg-indigo-800'
                        } rounded-lg focus:shadow-outline`}
                >
                    Generate Certificate
                </button>
            </div>
            <div className="flex-grow overflow-x-auto bg-gray-50 rounded-lg">
                {certmsg}
            </div>
            {payerDetails && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Certificate Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valid From
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valid Until
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Download
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(payerDetails) && payerDetails.map((p, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap"> {p.cert_type || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(p.validity_notbefore) || 'No Data'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"> {formatDate(p.validity_notafter) || 'No data'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={handleDownloadCertificate}
                                            title="Download Certificate"
                                            className="inline-flex items-center justify-center p-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PublishServerCertificate;
