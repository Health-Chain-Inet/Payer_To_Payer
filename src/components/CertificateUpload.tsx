import React, {useEffect} from 'react';
import { Upload, CheckCircle, AlertCircle, ArrowDown, } from 'lucide-react';
import { useForm } from 'react-hook-form';
import config from '../config/config.js';


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
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [uploading, setUploading] = React.useState(false);
  const [certificate, setCertificate] = React.useState('');
  const [msg, setmsg] = React.useState('');
  const [certmsg, setcertmsg] =  React.useState('')
  const [payerDetails, setPayerDetails] = React.useState<PayerDetails | null>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  // Check for verification status
  const areAllVerified = payerDetails && Array.isArray(payerDetails) && payerDetails.length > 1
  ? true
  : false;

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(payerDetails)
      ? payerDetails.slice(indexOfFirstItem, indexOfLastItem)
      : [];
    const totalPages = Math.ceil((payerDetails?.length || 0) / itemsPerPage);

 


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

  // Fetch payer details on component mount
  useEffect(() => {
    fetchPayerDetails();
  }, [setValue]);


 
  const onDownload = () => {
    console.log('on download start');
    const email = localStorage.getItem('email');
    console.log('1. Email retrieved:', email);

    if (!email) {
      console.log('Email not found in localStorage');
      return;
    }

    console.log('2. Starting fetch request');
    fetch(`http://localhost:3001/directory/downloadcertificate`, {
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
        
        const jsonString = JSON.stringify(json.message, null, 2);
        console.log('6. Formatted JSON string created');

        const blob = new Blob([jsonString], { type: 'application/json' });
        console.log('7. Blob created');

        const url = window.URL.createObjectURL(blob);
        console.log('8. URL created:', url);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'certificate.txt';
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCertificate(reader.result as string);  // Store the certificate text
        console.log('res=', reader.result)
      };
      reader.readAsText(file);  // Read the file as text
    }
  };

  const onSubmit = async (cdata: any) => {
  
    console.log("cdata=", cdata)
    console.log("certificate read start= ",  cdata.certificate[0])
    setUploading(true);

    try {
      setmsg('uploading.. please wait')

      const user = localStorage.getItem('user')
      const email = localStorage.getItem('email')
 
      const postdata = {
        certcontent: {certificate}, 
        user: user, 
        email: email, 
        endpoint: cdata.endpoint
      } 

      const result = await fetch('http://localhost:3001/certificate/uploadcertificate', {
        method: 'POST',
        body: JSON.stringify(postdata),
      });

      console.log('result=', result);
      setmsg('file uploaded')
      setTimeout(()=>{
        setmsg('')
      }, 2500)

      fetchPayerDetails()
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  
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


  const generateCertificate = async () => {
    setmsg('Creating Certificate Please wait.. ')
    
    const email = localStorage.getItem('email');
    const fetchmycerturl = config.apiUrl + '/directory/generatecertificate'
    console.log('email:', email)
    const postdata = {
      email: email
    }
    await fetch(fetchmycerturl, {
      method: 'POST',
      body: JSON.stringify(postdata), 
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(async(data) => {
    console.log('response = ',data)
    setmsg('Certificate Created . refreshing details')
    await fetchPayerDetails()
    setTimeout(()=>{
      setmsg('')
    }, 3500)
  })
  .catch(error => console.error('Error:', error));
    
  }

  const verifyCertificate = async(payer_id:any, cert_type:any) => {
      console.log('payer_id=', payer_id)
      console.log('cert_type=', cert_type)

      let connectapiurl = config.apiUrl + '/directory/';
      connectapiurl += (cert_type == 'client')?'/validateclient?payer_id='+payer_id:'/validateserver?payer_id='+payer_id;
      setmsg('Verifying certificate. Please wait..')
      await fetch(connectapiurl,{method:'get'})
      .then(response => response.json()).then(async(data)=>{
        console.log('data=', data);
        setmsg('Certificate verified')
        await fetchPayerDetails()
        if(data.status == 200 && data.data.status == 200) {
          setmsg(data.message + ' - '+ data.data.msg)
        }

        setTimeout(() => { setmsg('') }, 5000)
      })
      .catch(error => {
        setmsg(error)
        setTimeout(() => { setmsg('') }, 5000)
        console.log('Error:', error)
      });
  }
  


  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="space-y-4	flex justify-end">
        <button
          type="button"
          value="Generate Certificate"
          onClick={generateCertificate}
          disabled={areAllVerified}
          className={`h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 ${
            areAllVerified 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-700 hover:bg-indigo-800'
          } rounded-lg focus:shadow-outline`}          >
          Generate Certificate
        </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 hidden">
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
                {/* <div>
                  <h3>PEM File Content:</h3>
                  <pre>{certificate}</pre>
                </div> */}
              </div>
            </div>

            {errors.certificate && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                Certificate is required
              </div>
            )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payer Endpoint URL/ Payer Base URL
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
          </div>
          <div>
            {msg}
          </div>
        </form>
      </div>
      {/* Payer Details Display Section - Always Visible */}
      {payerDetails && (

<div className="bg-white shadow sm:rounded-lg p-6 mt-4">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Details</h2>
  <div className="flex-grow overflow-x-auto bg-gray-50 rounded-lg">
       {certmsg}
    </div>   
  <div className="flex gap-4">
 
    <div className="flex-grow overflow-x-auto bg-gray-50 rounded-lg">
      <table className="min-w-full">
        <thead className='bg-blue-100'>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Payer Name</th>
            {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Admin Name</th> */}
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Certificate Type</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Certificate Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Valid From</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Valid Until</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>



        <tbody>
          {Array.isArray(payerDetails) && payerDetails.map((p, index) => (

            <tr key={`${p.payer_id}-${index}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {p.payer_name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
              {p.cert_type || 'N/A'}
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
                {formatDate(p.validity_notbefore) || 'No Data'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatDate(p.validity_notafter) || 'No data'}
              </td>

              <td className="flex gap-2 items-center p-2 m-2">
                <button disabled={ p.certificate_verified }    
                 title="Verify" onClick={() => verifyCertificate(p.payer_id, p.cert_type)} className="flex justify-center py-1 px-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {/* Verify <br /> Certificate */}
                </button>

                <button  title="Download" onClick={onDownload} className="flex justify-center py-1 px-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400">
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

         {/* Pagination Controls */}
         <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}
              `}
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => {
                if (
                  index < 3 ||
                  index === currentPage - 1 ||
                  index > totalPages - 4
                ) {
                  return (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`
                        w-10 h-10 rounded-md text-sm font-medium transition-colors duration-200
                        ${currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                } else if (index === 3 || index === totalPages - 4) {
                  return <span key={index}>...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}
              `}
            >
              Next
            </button>
          </div>
  
</div>


)}
    </div>
  );
}