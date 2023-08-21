const axios = require('axios')

exports.handler = async (event, context) => {

    try {

        const apiURL = 'https://api.openweathermap.org/data/2.5/weather?zip='+ event.arguments.id+'&appid=d85d4a05094e7627083a934f9fc69b53';
        const apiResponseData = await axios.get(apiURL);
    
        const response = apiResponseData.data;

        return {
            statusCode: 200,
            body: response,
        };
    
    } 
    catch (error) {

        console.log('Got an error from the service');
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Something went wrong with the call the the Weather API'})
        }

    }

}