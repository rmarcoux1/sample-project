const axios = require('axios');

exports.handler = async(event, context) => {
    try {

        const appUrl = 'https://swapi.dev/api/people/' + event.arguments.id;
        const response  = await axios.get(appUrl);

        const responseData = response.data;

        return {
            statusCode: 200,
            body: responseData
        };

    } catch (error) {
        console.error('Error calling the service: ', error)
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Something went wrong with the call the the Starwars API'})
        }

    }
}