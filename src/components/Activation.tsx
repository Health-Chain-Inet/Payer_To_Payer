import config from '../config/config'
import { useLocation } from 'react-router-dom';


import React, { useEffect, useState } from 'react';





const Activation: React.FC = () => {
    const [message, setmessage] = useState('')
    const location = useLocation();

    useEffect(() => {
        let furl = config.Appurl;
        console.log('use effect')
        let burl = config.apiUrl;
        const queryParams = new URLSearchParams(location.search);
        //Get specific query parameter values
        const key = queryParams.get('key'); // Get 'param1' value
        const actId = queryParams.get('actId'); // Get 'params 
        burl += '/verify/verify?key=' + key + '&actId=' + actId;
        console.log(burl)
        fetch(burl)
            .then(response => response.json()) // assuming the server returns a JSON response
            .then(data => {
                console.log(data)
                if (data.message == 'Payers activated') {

                    // setmessage("Payer Activated Click - <a href='" + furl + "/login" + "' >Activate</a>")
                    setmessage(`Payer Activated Click - <a href='${furl}/login'>Activate</a>`);

                } else {
                    setmessage('Payer is not activated')
                }
            })
            .catch((error) =>
                setmessage(error)
            );
    })

    return (
        <>
            Message:
            {message}
        </>
    );
};

export default Activation;
