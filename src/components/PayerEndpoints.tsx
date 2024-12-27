import React, { useState, useEffect } from "react";
import config from '../config/config.js';


interface Payer {
    payer_id: string;
    payer_name: string;
}

interface FormDataType {
    payerId: string;
    payerName: string;
    endpointName: string;
    baseUrl: string;
    authScope: string;
    authorizeUrl: string;
    tokenUrl: string;
    returnUrl: string;
    authType: string;
    email:string;
}

const PayerEndpointsForm: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>({
        payerId: "",
        payerName: "",
        endpointName: "",
        baseUrl: "",
        authScope: "",
        authorizeUrl: "",
        tokenUrl: "",
        returnUrl: "",
        authType: "",
        email:"",
    });



    const [payerOptions, setPayerOptions] = useState<Payer[]>([]);
    const [selected, setSelected] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
    const [msg, setmsg] = useState('')

    const fetchPayers = async () => {
        try {
            const response = await fetch("http://localhost:3001/enroll/allPayers");
            const result = await response.json();

            // Log the response to verify data structure
            console.log("API Response:", result);

            // Ensure we're accessing the correct data path
            const payersData = result.data || [];
            setPayerOptions(payersData);
            console.log(localStorage.getItem('payer_id'))
            setSelected(localStorage.getItem('payer_id'))
            payerOptions.map((p)=>{
                if(p.payer_id == selected) {
                    console.log(p.payer_name)
                    setFormData((prevState) => ({
                        ...prevState,
                        "payerId": p.payer_id,
                    }));
                    setFormData((prevState) => ({
                        ...prevState,
                        "payerName": p.payer_name,
                    }));
                }
            })

        } catch (error) {
            console.error("Error fetching payers:", error);
        }
    };

    const fetchEndpoint = async () => {
        try {
            const payerId = localStorage.getItem('payer_id')
            const response = await fetch("http://localhost:3001/enroll/endpoint?payerId="+payerId);
            const result = await response.json();

            // Log the response to verify data structure
            console.log("API Response:", result);

            // Ensure we're accessing the correct data path
            const endData = result.data || [];
            console.log('endp=', endData);
            const fdata = {
                payerId: endData.payer_id,
                payerName: "",
                endpointName: endData.endpoint_name,
                baseUrl: endData.base_url,
                authScope: endData.auth_scope,
                authorizeUrl: endData.authorize_url,
                tokenUrl: endData.token_url,
                returnUrl: endData.return_url,
                authType: endData.auth_type,
                email:endData.adm_email,
            }
            setFormData(() => (fdata));
            console.log('fdata',formData)
        } catch (error) {
            console.error("Error fetching payers:", error);
        }
    }
    // Enhanced useEffect with proper error handling and loading state
    useEffect(() => {
        fetchPayers();
        fetchEndpoint();
    }, []);

    const handleChange = (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        // Add a console.log to verify the selected value
        //console.log("Selected Payer ID:", value);

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            setmsg('Wait. Updating endpoint info!')
            setFormData((prevState:any) => ({
                ...prevState,
                "email": localStorage.getItem('email'),
            }));
            console.log("Form Data:", formData);
            const response = await fetch(config.apiUrl+`/enroll/payerendpoints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:  JSON.stringify(formData)
            });
            const data = await response.json();
            console.log('data=', data)
            if(data.status == 200) {
                setmsg('getting data..')
                await fetchPayers();
                setmsg('Endpoint Updated Successfully')
            } else { setmsg(data.message + ': '+ data.data)}

        }
        catch(err:any) {
            setmsg(err.message);
            setTimeout(()=>{ setmsg('') }, 5000)
        }
     
    };

    return (
        <div className="flex flex-col gap-8 p-8">

            {/* Form Data Preview section remains unchanged */}
            <div className=" w-full">
                <div className="bg-white rounded shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-indigo-600">Form Data Preview</h2>
                        <button
                            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                            className="text-xl font-bold text-gray-500 hover:text-gray-700"
                        >
                            {isPreviewExpanded ? '×' : '+'}
                        </button>
                    </div>

                    {isPreviewExpanded && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Field
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Payer Name
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <select
                                                value={selected}
                                                onChange={handleChange}
                                                name="payerName"
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Select a Payer</option>
                                                {payerOptions.map((p) => (
                                                    
                                                    <option key={p.payer_id} value={p.payer_id}>
                                                        {p.payer_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Endpoint Name
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formData.endpointName || "No data"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Base URL
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formData.baseUrl || "No data"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Auth Scope
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formData.authScope || "No data"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Authorize URL
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formData.authorizeUrl || "No data"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Token URL
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formData.tokenUrl || "No data"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Return URL
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formData.returnUrl || "No data"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Auth Type
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formData.authType || "No data"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {/* Form Data Preview section remains unchanged */}


            {/* Form */}
            <div className="w-full">
 
                <div className="bg-white rounded shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-indigo-600">Payer Endpoints Form</h2>
                        <button
                            onClick={() => setIsFormExpanded(!isFormExpanded)}
                            className="text-xl font-bold text-gray-500 hover:text-gray-700"
                        >
                            {isFormExpanded ? '×' : '+'}
                        </button>
                    </div>

                    {isFormExpanded && (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="payerName"
                                    >
                                        Payer Name
                                        {payerOptions.map((p) => (
                                         (p.payer_id === localStorage.getItem('payer_id')?true:false)
                                        ))}
                                    </label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="payerIdSelect"
                                        name="payerName"
                                        value={selected}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a Payer</option>
                                        {payerOptions && payerOptions.length > 0 ? (
                                        payerOptions.map((p) => (
                                            <option 
                                                key={p.payer_id} 
                                                value={p.payer_id} 
                                                id= {p.payer_id}
                                                selected={(p.payer_id == selected)?true:false}
                                            >
                                                {p.payer_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No payers available</option>
                                    )}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="endpointName"
                                    >
                                        Endpoint Name
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="endpointName"
                                        name="endpointName"
                                        value={formData.endpointName}
                                        onChange={handleChange}
                                        required={true}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="baseUrl"
                                    >
                                        Base URL
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="baseUrl"
                                        name="baseUrl"
                                        value={formData.baseUrl}
                                        onChange={handleChange}
                                        required={true}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="authScope"
                                    >
                                        Auth Scope
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="authScope"
                                        name="authScope"
                                        value={formData.authScope}
                                        onChange={handleChange}
                                        required={true}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="authorizeUrl"
                                    >
                                        Authorize URL
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="authorizeUrl"
                                        name="authorizeUrl"
                                        value={formData.authorizeUrl}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="tokenUrl"
                                    >
                                        Token URL
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="tokenUrl"
                                        name="tokenUrl"
                                        value={formData.tokenUrl}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="returnUrl"
                                    >
                                        Return URL
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="returnUrl"
                                        name="returnUrl"
                                        value={formData.returnUrl}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="authType"
                                    >
                                        Auth Type
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        id="authType"
                                        name="authType"
                                        value={formData.authType}
                                        onChange={handleChange}
                                        required={true}

                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    Submit
                                </button>
                            </div>
                            <div className="bg-white rounded shadow-md p-6">
                                {msg}
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {/* Form */}

            
        </div>
    );
};

export default PayerEndpointsForm;
