type ResolverProps  = {
    appsyncFunction: string;
    dataSourceName: string;
    fieldNames: Array<string>;
    requestMappingTemplate: string;
    responseMappingTemplate: string;
    types: Array<string>;
}

export const resolvers: Array<ResolverProps> = [
    {
        appsyncFunction: "getWeatherFromService",
        dataSourceName: "getWeather",
        fieldNames: ["getWeather"],
        requestMappingTemplate: "weather/weather-request",
        responseMappingTemplate: "weather/weather-response",
        types: ["Query"]
    },
    {
        appsyncFunction: "getCharacterFromService",
        dataSourceName: "getCharacter",
        fieldNames: ["getCharacter"],
        requestMappingTemplate: "starwars/starwars-request",
        responseMappingTemplate: "starwars/starwars-response",
        types: ["Query"]
    }
]