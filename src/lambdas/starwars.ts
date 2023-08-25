import axios from "axios";

export const handler = async(event: any) => {
    try {

        const appUrl = 'https://swapi.dev/api/people/' + event.arguments.id;
        const response  = await axios.get(appUrl);

        return {
            statusCode: 200,
            body: response.data
        };

    } catch (error) {
        console.error('Error calling the service: ', error)
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Something went wrong with the call the the Starwars API'})
        }
    }
}