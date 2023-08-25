type AppSyncServiceFunctionProps = {
    lambdaDataSourceName: string;
    requestMappingTemplate: string;
    responseMappingTemplate: string;
}

export const appsyncServiceFunctions: { [ key:string ]: AppSyncServiceFunctionProps } = {
    getWeatherFromService: {
        lambdaDataSourceName: "getWeather",
        requestMappingTemplate: "weather/weather-request",
        responseMappingTemplate: "weather/weather-response"
    },
    getCharacterFromService: {
        lambdaDataSourceName: "getCharacter",
        requestMappingTemplate: "starwars/starwars-request",
        responseMappingTemplate: "starwars/starwars-response"
    }
}