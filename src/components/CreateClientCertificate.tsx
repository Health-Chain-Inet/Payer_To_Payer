import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import config from '../config/config.js';


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


const CreateClientCertificate: React.FC<CreateClientCertificateProps> = ({ privateKey, csr }) => {
    const [certmsg, setcertmsg] = React.useState('')
    const [payerDetails, setPayerDetails] = React.useState<PayerDetails | null>([]);
    const [isDisabled, setIsDisabled] = React.useState(false)


    // Add these state variables at the top of your component
    const [textareaValues, setTextareaValues] = useState({
        privateKey: privateKey || '',
        csr: csr || ''
    });



    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const [certificates, setCertificates] = useState<Certificate[]>([
        {
            type: 'Client Certificate',
            validFrom: '2024-01-01',
            validUntil: '2025-01-01'
        }
    ]);

    const fetchPayerDetails = async () => {
        const email = localStorage.getItem('email');
        console.log('Fetching payer details for email:', email);
        if (!email) return;

        setcertmsg('Loading...')
        try {
            const response = await fetch(`http://localhost:3001/directory/fetchcertificatedetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            console.log('response', data)
            setcertmsg('')
            if (data.message.length > 0) {
                let res = data.message;
                res = res.filter(p => p.cert_type === 'client');
                console.log('res=', res)
                setPayerDetails(res);
                setIsDisabled(true)
            }

            //   // Auto-fill the endpoint field
            //   if (data.endpoint) {
            //     console.log('Payer details fetched:', data);
            //     setValue('endpoint', data.endpoint);
            //   }
            //   console.log(data)
        } catch (error) {
            console.error('Error fetching payer details:', error);
        } finally {
            // setIsLoading(false);
        }
    };

    const handleDownloadCA = () => {
        // URL of the file to download
        const url = 'http://localhost:3001/directory/downloadintermediate';

        // Create a temporary download link
        const link = document.createElement('a');

        // Set the href to the URL where the file is hosted
        link.href = url;

        // Set the download attribute with the filename
        link.download = 'CA_Intermediate_Certificate.txt';

        // Append the link to the body and simulate a click to trigger the download
        document.body.appendChild(link);
        link.click();

        // Remove the link from the DOM after the download is triggered
        document.body.removeChild(link);
    };


    const handleGenerateCertificate = async (e) => {
        e.preventDefault();
        setcertmsg('Generating Please Wait.. ')
        const postdata = {
            'private_key':document.getElementById('private_key')?.textContent,
            'csr': document.getElementById('csr')?.textContent,
            'payer_id': localStorage.getItem('payer_id'), 
            'email': localStorage.getItem('email')
        }

        console.log(postdata)

        try {
            setcertmsg('Client Certificate Generating.. ')
            const response = await fetch(config.apiUrl+`/directory/clientCertificate`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(postdata)
            });
            const data = await response.json();
            if(data.status == 200) {
                setcertmsg('getting data..')
                await fetchPayerDetails();
                setcertmsg('Generated Client Certificate')
            } else { setcertmsg('Error: Certificate Not generated')}
            console.log('response', data)
        } catch(err:any) {
            setcertmsg(err.message);
            console.log(err);
        }


    };

    const handleDownloadCertificate = (e) => {
        e.preventDefault();
        const payer_id = localStorage.getItem('payer_id')
        // Implement certificate download logic
                // URL of the file to download
                const url = 'http://localhost:3001/directory/downloadClientCert?payer_id='+payer_id;

                // Create a temporary download link
                const link = document.createElement('a');
        
                // Set the href to the URL where the file is hosted
                link.href = url;
        
                // Set the download attribute with the filename
                link.download = 'client_Certificate.txt';
        
                // Append the link to the body and simulate a click to trigger the download
                document.body.appendChild(link);
                link.click();
        
                // Remove the link from the DOM after the download is triggered
                document.body.removeChild(link);
    };


    // Fetch payer details on component mount
    useEffect(() => {
        fetchPayerDetails();
    }, []);

    // Function to format the date to 'dd-mm-yyyy'
    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0'); // Ensure day is two digits
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Get month and ensure it's two digits
        const year = d.getFullYear();
        // Get the hours, minutes, and seconds
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');

        // Return formatted date and time
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    // Add this handler function
    const handleTextareaChange = (field: 'privateKey' | 'csr', value: string) => {
        setTextareaValues(prev => ({
            ...prev,
            [field]: value
        }));
    };




    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Create Client Certificate</h2>
                {/* <button
                    onClick={handleDownloadCA}
                    className="px-6 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#252082] transition-colors duration-200"
                >
                    Download CA Intermediate Certificate
                </button> */}
            </div>
            <form onSubmit={handleGenerateCertificate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Private Key (PEM format)</h3>
                        <textarea
                            id="private_key"
                            name="private_key"
                            value={textareaValues.privateKey}
                            onChange={(e) => handleTextareaChange('privateKey', e.target.value)}
                            className="w-full h-72 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="Private Key will appear here"
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Certificate Signing Request (CSR) (PEM)</h3>
                        <textarea
                            id="csr"
                            name = "csr"
                            value={textareaValues.csr}
                            onChange={(e) => handleTextareaChange('csr', e.target.value)}
                            className="w-full h-72 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            placeholder="CSR will appear here"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={isDisabled}
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
            </form>
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

export default CreateClientCertificate;
