type LambdaDataSourceProps = {
    description: string;
    name: string;
}

export const lambdaDataSources: { [key:string]: LambdaDataSourceProps} = {
    getWeather: {
        description: "Get Weather by ZipCode",
        name: "GetWeatherLambdaDataSource"

    },
    getCharacter: {
        description: "Get Character by ID",
        name: "GetCharacterLambdaDataSource"
    }
}