import axios  from "axios";

export const handler = async(event: any) => {

    try {

        const apiURL = 'https://api.openweathermap.org/data/2.5/weather?zip='+ event.arguments.id+'&appid=APP_KEY';
        const apiResponseData = await axios.get(apiURL);

        return {
            statusCode: 200,
            body: apiResponseData.data,

        }

    } catch(error) {

        console.log('There was an error calling the Weather service');
        return {
            statusCode: 500,
            body: 'Error calling the Weather service'

        }
    }
}