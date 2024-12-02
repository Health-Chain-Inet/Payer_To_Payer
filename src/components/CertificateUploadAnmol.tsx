import React, { useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, ArrowDown, } from 'lucide-react';
import { useForm } from 'react-hook-form';
// import { json } from 'react-router-dom';

// Type definitions for better code organization
interface CertificateUploadProps {
  onUpload: (data: FormData) => Promise<void>;
}


interface PayerDetails {

  payer_name: string; // Corresponds to "payer_name"

  adm_name: string; // Corresponds to "adm_name"

  certificate_uploaded: boolean; // Corresponds to "certificate_uploaded"
  certificate_verified: boolean; // Corresponds to "certificate_verified"

  email: string | null; // Corresponds to "email"

  validity_notafter: string | null; // Corresponds to "validity_notafter"
  validity_notbefore: string | null; // Corresponds to "validity_notbefore"
}


export default function CertificateUpload({ onUpload }: CertificateUploadProps) {
  // Form and state management
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [uploading, setUploading] = React.useState(false);
  const [certificate, setCertificate] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [payerDetails, setPayerDetails] = React.useState<PayerDetails | null>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch payer details on component mount
  useEffect(() => {
    const fetchPayerDetails = async () => {
      const email = localStorage.getItem('email');
      console.log('Fetching payer details for email:', email);
      if (!email) return;


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

        setPayerDetails(data.message);
        console.log(payerDetails);

        // Auto-fill the endpoint field
        if (data.endpoint) {
          console.log('Payer details fetched:', data);
          setValue('endpoint', data.endpoint);
        }
        console.log(data)
      } catch (error) {
        console.log(Response)
        console.error('Error fetching payer details:', error);
      } finally {
        // setIsLoading(false);
      }
    };


    fetchPayerDetails();
  }, [setValue]);




  const onDownload = () => {
    const email = localStorage.getItem('email');
    console.log('1. Email retrieved:', email);

    if (!email) {
      console.log('Email not found in localStorage');
      return;
    }

    console.log('2. Starting fetch request');
    fetch(`http://localhost:3001/directory/fetchcertificatedetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })
      .then(response => {
        console.log('3. Response received:', response.status);
        return response.json();
      })
      .then(json => {
        console.log('4. JSON data:', json);
        console.log('5. JSON type:', typeof json);

        const jsonString = JSON.stringify(json, null, 2);
        console.log('6. Formatted JSON string created');

        const blob = new Blob([jsonString], { type: 'application/json' });
        console.log('7. Blob created');

        const url = window.URL.createObjectURL(blob);
        console.log('8. URL created:', url);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'certificate.json';
        console.log('9. Download link created');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('10. Download initiated and cleanup completed');
      })
      .catch(error => {
        console.error('Error in download process:', error);
        console.log('Error details:', {
          message: error.message,
          stack: error.stack
        });
      });
  };







  // const mockCertDetails = {
  //   payerName: "Sample Payer",
  //   adminName: "Admin User",
  //   certificateStatus: "Valid",
  //   validityNotBefore: "2024-01-01",
  //   validityNotAfter: "2025-01-01"
  // };



  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCertificate(reader.result as string);
      };
      reader.readAsText(file);
    }
  };



  // Form submission handler
  const onSubmit = async (formData: any) => {
    setUploading(true);
    setMsg('Uploading... please wait');

    try {
      const user = localStorage.getItem('user');
      const email = localStorage.getItem('email');

      const postData = {
        certcontent: { certificate },
        user: user,
        email: email,
        endpoint: formData.endpoint
      };

      const uploadResponse = await fetch('http://localhost:3001/certificate/uploadcertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
      });

      if (!uploadResponse.ok) throw new Error('Certificate upload failed');

      // Fetch certificate details after successful upload
      // const certResponse = await fetch(`http://localhost:3001/certificate/getCertificateDetails/${email}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });

      // if (!certResponse.ok) throw new Error('Failed to fetch certificate details');

      // const certData = await certResponse.json();
      // setPayerDetails(certData);

      setMsg('Certificate uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      setMsg('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setMsg(''), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Certificate Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Public Certificate (PEM format)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input
                        {...register('certificate', { required: true })}
                        type="file"
                        className="sr-only"
                        accept=".pem,.crt,.cer"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PEM, CRT, or CER up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Error Message for Certificate */}
            {errors.certificate && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                Certificate is required
              </div>
            )}

            {/* Endpoint URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payer Endpoint URL
              </label>
              <input
                type="url"
                {...register('endpoint', { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://api.example.com"
              />
              {errors.endpoint && (
                <p className="mt-2 text-sm text-red-600">Endpoint URL is required</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {uploading ? (
                <>
                  <Upload className="animate-spin h-5 w-5 mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Upload Certificate
                </>
              )}
            </button>

            {/* Status Message */}
            {msg && (
              <div className={`text-center text-sm ${msg.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
                {msg}
              </div>
            )}
          </div>
        </form>
      </div>


      {/* Payer Details Display Section - Always Visible */}

      {payerDetails && (

        <div className="bg-white shadow sm:rounded-lg p-6 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Details</h2>

          <div className="flex gap-4">
            <div className="flex-grow overflow-x-auto bg-gray-50 rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Payer Name</th>
                    {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Admin Name</th> */}
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Certificate Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Valid From</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Valid Until</th>
                  </tr>
                </thead>



                <tbody>
                  {Array.isArray(payerDetails) && payerDetails.map((p, index) => (

                    <tr key={p.payer_id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {p.payer_name || 'N/A'}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {payerDetails.adm_name}
                    </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {p.certificate_verified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {p.validity_notbefore || 'No Data'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {p.validity_notafter || 'No data'}
                      </td>

                      <td className="flex gap-2 items-center">

                        <button className="flex justify-center py-1 px-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {/* Verify <br /> Certificate */}
                        </button>

                        <button onClick={onDownload} className="flex justify-center py-1 px-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400">
                          <ArrowDown className="h-4 w-4 mr-1" />
                          {/* Download <br /> Certificate */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>


              </table>
            </div>



          </div>
        </div>


      )}
    </div>
  );
}
