type AppsyncFuntionProps = {
    lambdaDataSourceName: string;
    responseMappingTemplateFile: string;
};

export const appsyncServiceFunctions: { [key: string]: AppsyncFuntionProps }= {
    getCharacterService: {
        lambdaDataSourceName: "starwars",
        responseMappingTemplateFile: "starwars/starwars-response"
    },
    getWeatherService: {
        lambdaDataSourceName: "weather",
        responseMappingTemplateFile: "weather/weather-response"
    }
};