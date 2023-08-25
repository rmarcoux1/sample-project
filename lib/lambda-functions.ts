type LambdaFunctionProps = {
    description: string;
    entry: string
};

export const lambdaFunctions: {[key: string]: LambdaFunctionProps } = {
    getWeather: {
        description: "Get Weather by ZipCode",
        entry: "weather.ts"

    },
    getCharacter: {
        description: "Get Character by ID",
        entry: "starwars.ts"

    }
}